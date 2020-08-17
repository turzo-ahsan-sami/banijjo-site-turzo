import React from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';

const CustomSpinner = () => {
  return (
    <Container>
      <Row>
        <div className="mx-auto">
          <Spinner animation={'border'} variant="success" />
        </div>
      </Row>
    </Container>
  );
};

export default CustomSpinner;
