import React, { useEffect, useMemo } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { findAndUpdateUnreadToReadMessages } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const Messages = (props) => {
  const { messages, otherUser, userId, findAndUpdateUnreadToReadMessages } =
    props;

  useEffect(() => {
    const conversationId = messages[0].conversationId;

    findAndUpdateUnreadToReadMessages(conversationId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUser]);

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
    findAndUpdateUnreadToReadMessages: (conversationId) => {
      dispatch(findAndUpdateUnreadToReadMessages(conversationId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
