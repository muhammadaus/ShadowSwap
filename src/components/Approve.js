import { useState, useContext } from 'react'
import { BlockchainContext } from './App'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

const Withdraw = () => {
  const [amount, setAmount] = useState('')
  const { account } = useContext(BlockchainContext)

  const withdrawHandler = (e) => {
    e.preventDefault()
    console.log('Withdraw amount:', amount)
    // Here you would typically interact with the blockchain
    // For now, we'll just log the value
    setAmount('')
  }

  return (
    <div>
      <Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
        {account ? (
          <Form onSubmit={withdrawHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
            <Row>
              <Form.Text className='text-end my-2' muted>
                Shares: 0
              </Form.Text>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0"
                  min="0.0"
                  step="any"
                  id="shares"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <InputGroup.Text style={{ width: "100px" }} className="justify-content-center">
                  Shares
                </InputGroup.Text>
              </InputGroup>
            </Row>

            <Row className='my-3'>
              <Button type='submit' variant="dark">Withdraw</Button>
            </Row>

            <hr />

            <Row>
              <p><strong>EURC Balance:</strong> 0</p>
              <p><strong>USDC Balance:</strong> 0</p>
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

export default Withdraw;