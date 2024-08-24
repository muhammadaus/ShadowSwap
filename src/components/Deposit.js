import { useState, useContext } from 'react'
import { BlockchainContext } from './App'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

const Deposit = () => {
  const [token1Amount, setToken1Amount] = useState('')
  const [token2Amount, setToken2Amount] = useState('')
  const { account } = useContext(BlockchainContext)

  const amountHandler = (e) => {
    if (e.target.id === 'token1') {
      setToken1Amount(e.target.value)
    } else {
      setToken2Amount(e.target.value)
    }
  }

  const depositHandler = (e) => {
    e.preventDefault()
    console.log('Deposit:', token1Amount, token2Amount)
    // Here you would typically interact with the blockchain
    // For now, we'll just log the values
  }

  return (
    <div>
      <Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
        {account ? (
          <Form onSubmit={depositHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
            <Row>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  min="0.0"
                  step="any"
                  id="token1"
                  onChange={amountHandler}
                  value={token1Amount}
                />
                <InputGroup.Text style={{ width: "100px" }} className="justify-content-center">
                  TOKEN1
                </InputGroup.Text>
              </InputGroup>
            </Row>

            <Row className='my-3'>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0.0"
                  step="any"
                  id="token2"
                  onChange={amountHandler}
                  value={token2Amount}
                />
                <InputGroup.Text style={{ width: "100px" }} className="justify-content-center">
                  TOKEN2
                </InputGroup.Text>
              </InputGroup>
            </Row>

            <Row className='my-3'>
              <Button type='submit' variant="dark">Deposit</Button>
            </Row>
          </Form>
        ) : (
          <p
            className='d-flex justify-content-center align-items-center'
            style={{ height: '300px' }}
          >
            Please connect wallet.
          </p>
        )}
      </Card>
    </div>
  );
}

export default Deposit;