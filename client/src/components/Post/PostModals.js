import React from "react";
import { Icon, Modal, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { DeletePostModal } from "./DeletePostModal";

export function ModalForLoggedIn({ postId }) {
  return (
    <Modal trigger={<Icon name="ellipsis horizontal" />}>
      <Modal.Content>
        <Modal.Description>
          <Button as={Link} to={`/p/${postId}`} size="big" fluid>
            Go to post
          </Button>
          <Button size="big" fluid>
            Copy link
          </Button>
          <DeletePostModal postId={postId} />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export function ModalForLoggedIn({ postId }) {
  
    return (
      <Modal trigger={<Icon name="ellipsis horizontal" />}>
        <Modal.Content>
          <Modal.Description>
            <Button as={Link} to={`/p/${postId}`} size="big" fluid>
              Go to post
            </Button>
            <Button size="big" fluid>
              Copy link
            </Button>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  
}
