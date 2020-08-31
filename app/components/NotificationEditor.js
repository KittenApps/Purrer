import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Chip,
  Button,
  Checkbox,
  TextField,
  Tooltip,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SendTwoToneIcon from "@material-ui/icons/SendTwoTone";
import EnhancedEncryptionTwoToneIcon from "@material-ui/icons/EnhancedEncryptionTwoTone";
import NoEncryptionTwoToneIcon from "@material-ui/icons/NoEncryptionTwoTone";
import NotificationPreview from "./NotificationPreview";
import { getIdb } from "../util";
import { getRealm } from "../realm";

const URLregex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
const actionsRegex = /^\[([\w\s]*)\]\((https?:\/\/[^\s/$.?#].[^\s]*)\)(,?\s\[([\w\s]*)\]\((https?:\/\/[^\s/$.?#].[^\s]*)\))?$/;

function NotificationEditor(props) {
  const onChangeTitle = e => props.setTitle(e.target.value);
  const onChangeBody = e => props.setBody(e.target.value);
  const onChangeIcon = e => props.setIcon(e.target.value);
  const onChangeImage = e => props.setImage(e.target.value);
  const onChangeActions = e => props.setActions(e.target.value);

  const actionObject = useMemo(() => {
    if (props.actions === "") return undefined;
    if (URLregex.test(props.actions))
      return [{ title: "open meowtastic weblink", url: props.actions }];
    if (actionsRegex.test(props.actions)) {
      const rg = props.actions.match(actionsRegex);
      let a = [{ title: rg[1], url: rg[2] }];
      if (rg[3]) a.push({ title: rg[4], url: rg[5] });
      return a;
    }
    return null;
  }, [props.actions]);

  const handleReset = () =>
    [
      props.setTitle,
      props.setBody,
      props.setIcon,
      props.setImage,
      props.setActions
    ].forEach(f => f(""));

  const [e2ee, setE2ee] = useState(false);
  const handleE2ee = e => setE2ee(e.target.checked);
  const [channelSubs, setChannelSubs] = useState(null);

  useEffect(() => {
    getIdb()
      .then(db => db.get("settings", "ECDHkeys"))
      .then(k => k && props.setPublicKey(k.publicKey));
  }, []);

  useEffect(() => {
    if (props.publicKey === null) setE2ee(false);
  }, [props.publicKey]);

  useEffect(() => {
    setChannelSubs(null);
    getRealm()
      .then(({ subsColl }) =>
        subsColl.find(
          { channels: props.channel },
          { projection: { ECDHpublicKey: 1 } }
        )
      )
      .then(subs => setChannelSubs(subs))
      .catch(console.error);
  }, [props.channel, props.subscribed]);

  const handleSend = () => {
    let payload = {
      title: props.title,
      body: props.body,
      icon: props.icon,
      image: props.image,
      actions: actionObject,
      channel: props.channel
    };
    if (e2ee) {
      const crypto = window.crypto.subtle;
      const channel = props.channel;
      payload.timestamp = new Date().getTime();
      Promise.all([
        getIdb()
          .then(db => db.get("settings", "ECDHkeys"))
          .then(k =>
            crypto.importKey(
              "jwk",
              k.privateKey,
              { name: "ECDH", namedCurve: "P-256" },
              false,
              ["deriveKey"]
            )
          ),
        Promise.all(
          channelSubs.map(s =>
            crypto
              .importKey(
                "jwk",
                s.ECDHpublicKey,
                { name: "ECDH", namedCurve: "P-256" },
                false,
                []
              )
              .then(pk => ({ id: s._id, publicKey: pk }))
          )
        )
      ])
        .then(([privKey, pubs]) =>
          Promise.all(
            pubs.map(p =>
              crypto
                .deriveKey(
                  { name: "ECDH", namedCurve: "P-256", public: p.publicKey },
                  privKey,
                  { name: "AES-GCM", length: 256 },
                  false,
                  ["encrypt"]
                )
                .then(key => {
                  const iv = window.crypto.getRandomValues(new Uint8Array(16));
                  return crypto
                    .encrypt(
                      { name: "AES-GCM", iv, tagLength: 128 },
                      key,
                      new TextEncoder().encode(JSON.stringify(payload))
                    )
                    .then(pl => ({
                      id: p.id,
                      iv: Array.from(iv)
                        .map(b => b.toString(16).padStart(2, "0"))
                        .join(""),
                      payload: Array.from(new Uint8Array(pl))
                        .map(b => b.toString(16).padStart(2, "0"))
                        .join("")
                    }));
                })
            )
          )
        )
        .then(pls => {
          const payloads = pls.reduce((p, item) => {
            p[item.id] = {
              iv: item.iv,
              payload: item.payload,
              publicKey: props.publicKey
            };
            return p;
          }, {});
          return fetch("/.netlify/functions/sendE2EENotification", {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ payloads, channel })
          });
        });
    } else {
      fetch("/.netlify/functions/sendNotification", {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
  };

  return (
    <React.Fragment>
      <Typography color="secondary" variant="h5" style={{ marginBottom: 5 }}>
        Create new push notification:
      </Typography>
      <div style={{ display: "flex", margin: "10px 0" }}>
        <TextField
          label="title"
          error={props.title === ""}
          inputProps={{ "aria-label": "title" }}
          variant="outlined"
          color="secondary"
          value={props.title}
          onChange={onChangeTitle}
          style={{ marginRight: 8, flexGrow: 1 }}
          size="small"
          fullWidth
        />
        <Tooltip
          title="Toogles the end-to-end-encryption. If on the message will be encrypted with the public key of every recipient subscriped to the current channel and the stack of encrypted messages is send to our server for push delivery. If off the message will just be send tls encrypted to our server, where it gets processed and encryped for push delivery."
          arrow
        >
          <Checkbox
            icon={<NoEncryptionTwoToneIcon />}
            checkedIcon={<EnhancedEncryptionTwoToneIcon />}
            checked={e2ee}
            onChange={handleE2ee}
            disabled={!props.publicKey}
          />
        </Tooltip>
      </div>
      <TextField
        label="body text"
        inputProps={{ "aria-label": "body text" }}
        variant="outlined"
        color="secondary"
        value={props.body}
        onChange={onChangeBody}
        size="small"
        fullWidth
      />
      <TextField
        label="icon url"
        error={props.icon !== "" && !URLregex.test(props.icon)}
        inputProps={{ "aria-label": "icon url" }}
        variant="outlined"
        color="secondary"
        value={props.icon}
        onChange={onChangeIcon}
        style={{ margin: "10px 0" }}
        size="small"
        fullWidth
      />
      <TextField
        label="image url (optional landscape header, no Firefox support)"
        error={props.image !== "" && !URLregex.test(props.image)}
        inputProps={{ "aria-label": "image url" }}
        variant="outlined"
        color="secondary"
        value={props.image}
        onChange={onChangeImage}
        size="small"
        fullWidth
      />
      <TextField
        label="weblink buttons: url or [label1](url1), [label2](url2)"
        error={actionObject === null}
        inputProps={{ "aria-label": "weblink buttons" }}
        variant="outlined"
        color="secondary"
        value={props.actions}
        onChange={onChangeActions}
        style={{ margin: "10px 0" }}
        size="small"
        fullWidth
      />
      <div style={{ display: "flex" }}>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SendTwoToneIcon />}
          onClick={handleSend}
          style={{ flexGrow: 1, marginLeft: 8 }}
          disabled={
            (props.icon !== "" && !URLregex.test(props.icon)) ||
            (props.image !== "" && !URLregex.test(props.image)) ||
            actionObject === null ||
            props.title === "" ||
            !channelSubs
          }
        >
          Send Notification to #{props.channel}
          <Chip color="secondary" label={channelSubs === null ? "?" : channelSubs.length} size="small" style={{marginLeft: 5}}/>
        </Button>
      </div>
      <Typography
        color="secondary"
        variant="h5"
        style={{ margin: "20px 0 10px" }}
      >
        Notification preview:
      </Typography>
      <NotificationPreview
        title={props.title}
        body={props.body}
        icon={props.icon}
        image={props.image}
        actions={actionObject}
        publicKey={e2ee && props.publicKey}
        time={new Date().getTime()}
        highlight={false}
        inverseTheme={props.inverseTheme}
      />
    </React.Fragment>
  );
}

export default React.memo(NotificationEditor);
