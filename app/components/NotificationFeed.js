import * as React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { getIdb } from "../util";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Popover,
  Radio,
  RadioGroup,
  Typography
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { VariableSizeList, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import NotificationPreview from "./NotificationPreview";

function NotificationFeed(props) {
  const [notifications, setNotifications] = useState([]);
  const [channelFilter, setChannelFilter] = useState("");
  const [channels, setChannels] = useState([]);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const [listScrollOffset, setListScrollOffset] = useState(0);

  const listRef = useRef(null);

  const handleMenuOpen = e => setFilterMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setFilterMenuAnchor(null);
  const handleChannelFilterChange = e => {
    setChannelFilter(event.target.value);
    handleMenuClose();
  };

  const getCardHeight = c => {
    let h = 205;
    if (c.image) h += 273;
    if (c.actions) h += 38;
    return h;
  };

  useEffect(() => {
    let chans = new Set();
    const handleCursor = c => {
      if (!c) return setChannels(Array.from(chans));
      chans.add(c.key);
      c.continue().then(c => handleCursor(c));
    };
    getIdb()
      .then(db =>
        db
          .transaction("notifications")
          .store.index("channel")
          .openCursor()
      )
      .then(c => handleCursor(c));
  }, [notifications]);

  useEffect(() => {
    let keyRange;
    if (channelFilter) keyRange = IDBKeyRange.only(channelFilter);
    getIdb()
      .then(db => db.getAllFromIndex("notifications", "channel", keyRange))
      .then(n => setNotifications(n.sort((a, b) => b.timestamp - a.timestamp)));
  }, [channelFilter]);

  useEffect(() => {
    const newNotification = e => {
      if (e.data.type === "changeChannel") {
        setHighlight(e.data.id);
        if (channelFilter) setChannelFilter(e.data.channel);
        const index = notifications.findIndex(n => n.id === e.data.id);
        listRef.current.scrollToItem(index, "smart");
      }
      if (e.data.type === "newNotification") {
        if ([e.data.data.channel, ""].includes(channelFilter)) {
          setNotifications(on => [e.data.data, ...on]);
          // scroll to old scroll postion unless you're at the top (stay at 0 then)
          if (listScrollOffset)
            listRef.current.scrollTo(
              listScrollOffset + getCardHeight(e.data.data)
            );
        }
      }
    };
    navigator.serviceWorker.addEventListener("message", newNotification);
    return () =>
      navigator.serviceWorker.removeEventListener("message", newNotification);
  }, [channelFilter, notifications, listScrollOffset]);

  const deleteById = useCallback(id => {
    getIdb()
      .then(db => db.delete("notifications", id))
      .then(() => setNotifications(ns => ns.filter(n => n.id !== id)));
  }, []);

  const deleteByChannel = useCallback(channel => {
    let rids = [];
    let delPromises = [];
    const handleCursor = c => {
      if (!c)
        return Promise.all(delPromises).then(() =>
          setNotifications(ns => ns.filter(n => !rids.includes(n.id)))
        );
      rids.push(c.primaryKey);
      delPromises.push(c.delete());
      c.continue().then(c => handleCursor(c));
    };
    getIdb()
      .then(db =>
        db
          .transaction("notifications", "readwrite")
          .store.index("channel")
          .openCursor(IDBKeyRange.only(channel))
      )
      .then(c => handleCursor(c));
  }, []);

  useEffect(() => {
    listRef.current && listRef.current.resetAfterIndex(0);
  }, [notifications]);

  const card = React.memo(
    ({ index, style }) => (
      <div
        style={{
          ...style,
          bottom: style.top + 15,
          height: style.height - 15
        }}
      >
        <NotificationPreview
          highlight={notifications[index].id === highlight}
          title={notifications[index].title}
          body={notifications[index].body}
          icon={notifications[index].icon}
          image={notifications[index].image}
          actions={notifications[index].actions}
          time={notifications[index].timestamp}
          channel={notifications[index].channel}
          publicKey={notifications[index].publicKey}
          id={notifications[index].id}
          inverseTheme={props.inverseTheme}
          setTemplate={props.setTemplate}
          deleteById={deleteById}
          deleteByChannel={deleteByChannel}
        />
      </div>
    ),
    areEqual
  );

  const itemKey = useCallback(i => notifications[i].id.toString(), [
    notifications
  ]);
  const itemSize = useCallback(i => getCardHeight(notifications[i]), [
    notifications
  ]);
  const onScroll = useCallback(
    ({ scrollOffset }) => setListScrollOffset(scrollOffset),
    []
  );

  const feed = useMemo(
    () => (
      <AutoSizer>
        {({ height, width }) => (
          <VariableSizeList
            ref={listRef}
            height={height - 42}
            width={width + 7}
            itemCount={notifications.length}
            itemKey={itemKey}
            estimatedItemSize={478}
            itemSize={itemSize}
            overscanCount={3}
            onScroll={onScroll}
          >
            {card}
          </VariableSizeList>
        )}
      </AutoSizer>
    ),
    [notifications, highlight, props.inverseTheme, props.setTemplate]
  );

  const channelRadios = channels
    .sort()
    .map(c => (
      <FormControlLabel key={c} value={c} control={<Radio />} label={"#" + c} />
    ));

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline"
        }}
      >
        <Typography color="secondary" variant="h5" style={{ marginBottom: 10 }}>
          Notification feed:
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          endIcon={<ArrowDropDownIcon />}
          onClick={handleMenuOpen}
        >
          {channelFilter ? "#" + channelFilter : "all notifications"}
        </Button>
        <Popover
          anchorEl={filterMenuAnchor}
          elevation={16}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(filterMenuAnchor)}
          onClose={handleMenuClose}
        >
          <FormControl component="fieldset" style={{ margin: "10px 10px 0" }}>
            <FormLabel color="secondary">Channel filter:</FormLabel>
            <RadioGroup
              aria-label="channel"
              name="channel"
              value={channelFilter}
              onChange={handleChannelFilterChange}
            >
              <FormControlLabel
                key="all"
                value=""
                control={<Radio color="primary" />}
                label="show all"
              />
              {channelRadios}
            </RadioGroup>
          </FormControl>
        </Popover>
      </div>
      {feed}
    </React.Fragment>
  );
}

export default React.memo(NotificationFeed);
