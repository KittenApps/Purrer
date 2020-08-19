import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  AppBar,
  FormControlLabel,
  IconButton,
  InputBase,
  Switch,
  Toolbar,
  Tooltip,
  Typography
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { fade, makeStyles } from "@material-ui/core/styles";
import InvertColorsTwoToneIcon from "@material-ui/icons/InvertColorsTwoTone";
import { getIdb } from "../util";
const ThemeEditor = React.lazy(() =>
  import(/* webpackChunkName: "themeEditor" */ "./ThemeEditor")
);

const useStyles = makeStyles(theme => ({
  header: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  channel: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  hashTag: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "120px",
      "&:focus": {
        width: "200px"
      }
    }
  },
  switch: {
    margin: "0 8px"
  },
  listbox: {
    width: 200,
    margin: 0,
    padding: 0,
    zIndex: 1,
    position: "absolute",
    listStyle: "none",
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
    maxHeight: 200,
    border: "1px solid rgba(0,0,0,.25)",
    '& li[data-focus="true"]': {
      backgroundColor: "#4a8df6",
      color: "white",
      cursor: "pointer"
    },
    "& li:active": {
      backgroundColor: "#2977f5",
      color: "white"
    }
  }
}));

function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

function KittenHeader(props) {
  const [channel, setChannel] = useState(props.channel);

  const [subChannels, setSubChannels] = useState(null);

  // handle URL hash change
  useEffect(() => {
    const handleHash = () =>
      props.setChannel(location.hash?.substring(1) || "KittenNews");
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // handle serviceWorker messages to change hash after clicking on notification
  useEffect(() => {
    const changeChannel = e => {
      if (e.data.type === "changeChannel") props.setChannel(e.data.channel);
    };
    navigator.serviceWorker.addEventListener("message", changeChannel);
    return () =>
      navigator.serviceWorker.removeEventListener("message", changeChannel);
  }, []);

  // change url hash and our local input channel copy from external channel changes
  useEffect(() => {
    if (props.channel !== channel) setChannel(props.channel);
    if (props.channel !== location.hash?.substring(1))
      location.hash = "#" + props.channel;
  }, [props.channel]);

  // handle subscribtion switch presses
  const [subscribed, setSubscribed] = useState(null);
  const handleSubscription = e => {
    const toSubscribe = e.target.checked;
    navigator.serviceWorker.ready
      .then(reg => {
        const crypto = window.crypto.subtle;
        const getPublicKey = () =>
          getIdb().then(db => {
            return db.get("settings", "ECDHkeys").then(k => {
              if (k) return k.publicKey;
              return crypto
                .generateKey({ name: "ECDH", namedCurve: "P-256" }, true, [
                  "deriveKey"
                ])
                .then(key => {
                  return Promise.all([
                    crypto.exportKey("jwk", key.publicKey),
                    crypto.exportKey("jwk", key.privateKey)
                  ]).then(([pub, priv]) => {
                    props.setPublicKey(pub);
                    return db
                      .add("settings", {
                        id: "ECDHkeys",
                        publicKey: pub,
                        privateKey: priv
                      })
                      .then(() => pub);
                  });
                });
            });
          });
        const removeKeys = () =>
          getIdb()
            .then(db => db.delete("settings", "ECDHkeys"))
            .then(() => props.setPublicKey(null));
        return Promise.all([
          reg.pushManager.getSubscription().then(sub => {
            if (sub) {
              if (!toSubscribe) {
                if (subChannels.size > 1 || !subChannels.has(channel))
                  return sub;
                return sub.unsubscribe().then(() => sub);
              }
              return sub;
            }
            const convertedVapidKey = urlBase64ToUint8Array(
              process.env.VAPID_PUBLIC_KEY
            );

            return reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey
            });
          }),
          toSubscribe
            ? getPublicKey()
            : subChannels.size === 1 || subChannels.has(channel)
            ? removeKeys()
            : Promise.resolve("")
        ]);
      })
      .then(([subscription, jwk]) => {
        let json = { subscription, channel: channel };
        if (toSubscribe) json.ECDHpublicKey = jwk;
        return fetch(toSubscribe ? "./register" : "./unregister", {
          method: "post",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(json)
        });
      })
      .then(() => {
        if (toSubscribe) {
          setSubChannels(sc => new Set(sc).add(channel));
        } else {
          setSubChannels(sc => {
            const s = new Set(subChannels);
            s.delete(channel);
            return s;
          });
        }
        setSubscribed(toSubscribe);
      });
  };

  // get inital subscribtion status after changeing channel
  useEffect(() => {
    navigator.serviceWorker.ready
      .then(reg => reg.pushManager.getSubscription())
      .then(sub => {
        if (sub === null) return setSubscribed(false);
        if (subChannels !== null)
          return setSubscribed(subChannels.has(channel));
        return fetch("./getSubscribedChannels", {
          method: "post",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint })
        })
          .then(r => r.json())
          .then(r => {
            setSubChannels(new Set(r.channels));
            setSubscribed(r.channels.includes(channel));
          });
      });
  }, [channel, subChannels]);

  const [themeEditorOpened, setThemeEditorOpened] = useState(false);
  const handleThemeEditorOpen = () => setThemeEditorOpened(true);

  const classes = useStyles();

  const onInputChange = useCallback((e, c) => setChannel(c || ""), []);
  const onClose = useCallback(
    (e, r) => {
      if (r === "blur") {
        if (!channel) {
          const c = props.channel === "KittenNews" ? "Kitten" : "KittenNews";
          props.setChannel(c);
          return setChannel(c);
        }
        props.setChannel(channel);
      }
    },
    [channel, props.channel]
  );
  const onChange = useCallback((e, c) => c && props.setChannel(c), []);
  const renderInput = useCallback(
    params => (
      <div className={classes.channel}>
        <div className={classes.hashTag}>#</div>
        <InputBase
          ref={params.InputProps.ref}
          inputProps={{ ...params.inputProps, "aria-label": "channel" }}
          placeholder="channel"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
        />
      </div>
    ),
    [classes]
  );

  return (
    <header className={classes.header}>
      <AppBar position="fixed" elevation={12}>
        <Toolbar variant="dense">
          <Typography variant="h6" className={classes.title} noWrap>
            😺💌 Purrer
          </Typography>
          <Autocomplete
            options={Array.from(subChannels || []).sort()}
            getOptionLabel={l => l}
            freeSolo
            value={props.channel}
            onInputChange={onInputChange}
            onClose={onClose}
            onChange={onChange}
            renderInput={renderInput}
          />
          <Tooltip
            title="Subscribe to receive notifications for the chosen channel"
            arrow
          >
            <FormControlLabel
              label="Subscribe"
              labelPlacement="end"
              className={classes.switch}
              control={
                <Switch
                  color="secondary"
                  checked={subscribed || false}
                  disabled={subscribed === null}
                  onChange={handleSubscription}
                />
              }
            />
          </Tooltip>
          <div style={{ flexGrow: 1 }} />
          <Tooltip title="Customize theme colors" arrow>
            <IconButton color="secondary" onClick={handleThemeEditorOpen}>
              <InvertColorsTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      {themeEditorOpened && (
        <React.Suspense fallback={null}>
          <ThemeEditor
            open={themeEditorOpened}
            setOpen={setThemeEditorOpened}
            theme={props.theme}
            setTheme={props.setTheme}
          />
        </React.Suspense>
      )}
    </header>
  );
}

export default React.memo(KittenHeader);
