import * as React from "react";
import { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography
} from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import DeleteSweepTwoToneIcon from "@material-ui/icons/DeleteSweepTwoTone";
import EnhancedEncryptionTwoToneIcon from "@material-ui/icons/EnhancedEncryptionTwoTone";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    height: 150,
    overflowY: "auto",
    width: "100%"
  },
  body: {
    flex: "1 1 auto"
  },
  icon: {
    width: 151,
    margin: 20,
    flex: "0 0 auto",
    backgroundPositionY: "top",
    backgroundPositionX: "left"
  },
  image: {
    height: 273,
    backgroundPositionY: "top",
    backgroundPositionX: "left"
  },
  actions: {
    justifyContent: "center",
    padding: "0 8px 8px"
  }
}));

function NotificationPreview(props) {
  const classes = useStyles();

  const time = new Date(props.time).toLocaleString(navigator.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  });

  const channel = props.channel
    ? "in #" + props.channel
    : "purrer.netlify.app";

  const hcolor = {
    backgroundColor:
      props.inverseTheme.palette.mode === "dark" ? "#4f5835" : "#cfddaa"
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = e => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleTemplate = () => {
    props.setTemplate(props);
    handleClose();
  };
  const handleDeleteId = () => {
    props.deleteById(props.id);
    handleClose();
  };
  const handleDeleteChannel = () => {
    props.deleteByChannel(props.channel);
    handleClose();
  };

  return (
    <ThemeProvider theme={props.inverseTheme}>
      <Card style={{ maxWidth: 552 }}>
        {props.image && (
          <CardMedia
            className={classes.image}
            image={props.image}
            title="notification header image"
          />
        )}
        <div className={classes.root} style={props.highlight ? hcolor : {}}>
          {props.icon && (
            <CardMedia
              className={classes.icon}
              image={props.icon}
              title="notification icon"
              style={{ width: 150, height: 150 }}
            />
          )}
          <CardContent className={classes.content}>
            {props.publicKey && (
              <Typography
                color="textSecondary"
                style={{ fontSize: 12 }}
                gutterBottom
              >
                <EnhancedEncryptionTwoToneIcon
                  style={{ fontSize: 22, margin: "-5px 0 -5px -5px" }}
                />{" "}
                {props.publicKey.x}
              </Typography>
            )}
            <div style={{ display: "flex" }}>
              <Typography gutterBottom style={{ flexGrow: 1 }} variant="h5">
                {props.title}
              </Typography>
              {props.setTemplate && (
                <React.Fragment>
                  <IconButton
                    style={{ height: 48, margin: "-9px -9px 0 0" }}
                    onClick={handleClick}
                    aria-label="options"
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleTemplate}>
                      <ListItemIcon>
                        <EditTwoToneIcon />
                      </ListItemIcon>
                      Use as a template
                    </MenuItem>
                    <MenuItem onClick={handleDeleteId}>
                      <ListItemIcon>
                        <DeleteTwoToneIcon />
                      </ListItemIcon>
                      Delete this notification
                    </MenuItem>
                    <MenuItem onClick={handleDeleteChannel}>
                      <ListItemIcon>
                        <DeleteSweepTwoToneIcon />
                      </ListItemIcon>
                      Delete all notifications in #{props.channel}
                    </MenuItem>
                  </Menu>
                </React.Fragment>
              )}
            </div>
            <Typography
              className={classes.body}
              variant="body1"
              color="textSecondary"
            >
              {props.body}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {time} • {channel}
            </Typography>
          </CardContent>
        </div>
        {props.actions && (
          <CardActions
            className={classes.actions}
            style={props.highlight ? hcolor : {}}
          >
            <Button
              size="small"
              startIcon={<LinkIcon />}
              component="a"
              href={props.actions[0].url}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              {props.actions[0].title}
            </Button>
            {props.actions.length > 1 && (
              <Button
                size="small"
                startIcon={<LinkIcon />}
                component="a"
                href={props.actions[1].url}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                {props.actions[1].title}
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </ThemeProvider>
  );
}

export default React.memo(NotificationPreview);
