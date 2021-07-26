import React, { useMemo } from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  container: {
    padding: "4px 8px",
    backgroundColor: "#3A8DFF",
    borderRadius: "10px",
  },
  text: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: "12px",
    letterSpacing: -0.5,
  },
}));

function UnreadMessageCount({ messages, userId }) {
  const classes = useStyles();

  const unreadMessageCount = useMemo(() => {
    let unreadMessageCount = 0;

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];

      if (message.senderId !== userId) {
        if (message.isRead) {
          break;
        } else {
          unreadMessageCount++;
        }
      }
    }

    return unreadMessageCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return unreadMessageCount > 0 ? (
    <Box className={classes.container}>
      <Typography className={classes.text}>{unreadMessageCount}</Typography>
    </Box>
  ) : null;
}

export default UnreadMessageCount;
