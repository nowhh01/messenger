import React, { useEffect, useMemo } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { putUnreadToReadMessages } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const Messages = (props) => {
  const { messages, otherUser, userId, putUnreadToReadMessages } = props;

  useEffect(() => {
    const unreadMessageIds = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];

      if (message.senderId === otherUser.id) {
        if (message.isRead) {
          break;
        } else {
          unreadMessageIds.push(message.id);
        }
      }
    }

    if (unreadMessageIds.length > 0) {
      putUnreadToReadMessages(unreadMessageIds);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const latestReadMessageIndex = useMemo(() => {
    let latestReadMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];

      if (message.senderId === userId && message.isRead) {
        latestReadMessageIndex = i;
        break;
      }
    }

    return latestReadMessageIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <Box>
      {messages.map((message, i) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUserPhotoUrl={
              latestReadMessageIndex === i ? otherUser.photoUrl : null
            }
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => {
  return {
    putUnreadToReadMessages: (messageIds) => {
      dispatch(putUnreadToReadMessages(messageIds));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
