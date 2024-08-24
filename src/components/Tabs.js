import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from "react-router-bootstrap";

const Tabs = () => {
  return (
    <Nav variant="tabs" bg="dark" defaultActiveKey="/" className='justify-content-center my-4'>
      <LinkContainer to="/">
      <Nav.Link className="text-dark">Swap</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/deposit">
        <Nav.Link className="text-dark">Add Liquidity</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/withdraw">
        <Nav.Link className="text-dark">Remove Liquidity</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/approve">
        <Nav.Link className="text-dark">Approve</Nav.Link>
      </LinkContainer>
    </Nav>
  );
}

export default Tabs;
