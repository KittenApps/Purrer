import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Paper } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles
} from "@material-ui/core/styles";
import KittenHeader from "./KittenHeader";
const NotificationEditor = React.lazy(() =>
  import(/* webpackChunkName: "notificationEditor" */ "./NotificationEditor")
);
const NotificationFeed = React.lazy(() =>
  import(/* webpackChunkName: "notificationFeed" */ "./NotificationFeed")
);
import { defaultTheme, getIdb } from "../util";

const useStyles = makeStyles(theme => ({
  main: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    alignItems: "flex-start"
  },
  paper: {
    width: 554,
    margin: 10,
    padding: 15,
    overflowY: "auto",
    maxHeight: "calc(100% - 50px)"
  },
  paperFeed: {
    width: 569,
    margin: 10,
    padding: 15,
    overflowY: "auto",
    height: "calc(100% - 50px)"
  }
}));

function KittenPush() {
  const [channel, setChannel] = useState(
    location.hash?.substring(1) || "KittenNews"
  );

  const [theme, setTheme] = useState(createMuiTheme({ palette: defaultTheme }));

  useEffect(() => {
    getIdb()
      .then(db => db.get("settings", "defaultTheme"))
      .then(dt => dt && setTheme(createMuiTheme({ palette: dt.theme })));
  }, []);

  const inverseTheme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: { main: theme.palette.primary.main },
          secondary: { main: theme.palette.secondary.main },
          type: theme.palette.type === "dark" ? "light" : "dark"
        }
      }),
    [theme]
  );

  useEffect(() => {
    document.body.style.backgroundColor =
      theme.palette.type === "light" ? "#fafafa" : "#303030";
  }, [theme]);

  // maybe I should have used Redux
  const [title, setTitle] = useState("Kitten MotD");
  const [body, setBody] = useState("You're my super amazing kitten 💚");
  const [icon, setIcon] = useState(
    "https://cdn.glitch.com/project-avatar/537ecdf0-1261-4aff-943f-8e76988ab888.png"
  );
  const [image, setImage] = useState("https://i.imgur.com/feGnF.jpg");
  const [actions, setActions] = useState("");

  const setTemplate = useCallback(({ title, body, icon, image, actions }) => {
    setTitle(title || "");
    setBody(body || "");
    setIcon(icon || "");
    setImage(image || "");
    let as = "";
    if (actions) as += "[" + actions[0].title + "](" + actions[0].url + ")";
    if (actions?.length > 1)
      as += ", [" + actions[1].title + "](" + actions[1].url + ")";
    setActions(as);
  }, []);
  
  const [publicKey, setPublicKey] = useState(null);

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <KittenHeader
        theme={theme}
        setTheme={setTheme}
        channel={channel}
        setChannel={setChannel}
        setPublicKey={setPublicKey}
      />
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <div style={{ overflow: "hidden", width: 552 }}>
            <React.Suspense
              fallback={
                <React.Fragment>
                  <Skeleton
                    variant="text"
                    width={310}
                    height={32}
                    style={{ marginBottom: 5, paddingTop: 10 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={40}
                    style={{ margin: "0 0 10px" }}
                  />
                  <Skeleton variant="rectangular" width={"100%"} height={40} />
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={40}
                    style={{ margin: "10px 0" }}
                  />
                  <Skeleton variant="rectangular" width={"100%"} height={40} />
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={40}
                    style={{ margin: "10px 0" }}
                  />
                  <div style={{ display: "flex" }}>
                    <Skeleton variant="rectangular" width={75} height={36} />
                    <Skeleton
                      variant="rectangular"
                      height={36}
                      style={{ flexGrow: 1, marginLeft: 8 }}
                    />
                  </div>
                  <Skeleton
                    variant="text"
                    width={220}
                    height={32}
                    style={{ margin: "10px 0", paddingTop: 10 }}
                  />
                  <Skeleton variant="rectangular" width={"100%"} height={463} />
                </React.Fragment>
              }
            >
              <NotificationEditor
                channel={channel}
                inverseTheme={inverseTheme}
                title={title}
                setTitle={setTitle}
                body={body}
                setBody={setBody}
                icon={icon}
                setIcon={setIcon}
                image={image}
                setImage={setImage}
                actions={actions}
                setActions={setActions}
                publicKey={publicKey}
                setPublicKey={setPublicKey}
              />
            </React.Suspense>
          </div>
        </Paper>
        <Paper className={classes.paperFeed}>
          <React.Suspense
            fallback={
              <React.Fragment>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 3
                  }}
                >
                  <Skeleton
                    variant="text"
                    width={183}
                    height={32}
                    style={{ marginBottom: 5, paddingTop: 10 }}
                  />
                  <Skeleton variant="rectangular" width={170} height={30} />
                </div>
                <Skeleton variant="rectangular" width={"100%"} height={463} />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={463}
                  style={{ margin: "15px 0" }}
                />
                <Skeleton variant="rectangular" width={"100%"} height={463} />
              </React.Fragment>
            }
          >
            <NotificationFeed
              inverseTheme={inverseTheme}
              setTemplate={setTemplate}
            />
          </React.Suspense>
        </Paper>
      </main>
    </ThemeProvider>
  );
}

export default React.memo(KittenPush);
