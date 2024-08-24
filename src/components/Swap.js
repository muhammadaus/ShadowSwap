import { useState, useContext } from 'react'
import { BlockchainContext } from './App'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

const Swap = () => {
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const { account } = useContext(BlockchainContext)

  const swapHandler = (e) => {
    e.preventDefault()
    console.log('Swap:', inputAmount, 'for', outputAmount)
    // Here you would typically interact with the blockchain
    // For now, we'll just log the values
  }

  return (
    <div>
      <Card style={{ maxWidth: '450px' }} className='mx-auto px-4'>
        <Form onSubmit={swapHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
          <Row className='my-3'>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="0.0"
                min="0.0"
                step="any"
                onChange={(e) => setInputAmount(e.target.value)}
                value={inputAmount}
              />
              <InputGroup.Text>Input Token</InputGroup.Text>
            </InputGroup>
          </Row>

          <Row className='my-4'>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="0.0"
                value={outputAmount}
                onChange={(e) => setOutputAmount(e.target.value)}
              />
              <InputGroup.Text>Output Token</InputGroup.Text>
            </InputGroup>
          </Row>

          <Row className='my-3'>
            <Button type='submit' variant="dark">Swap</Button>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default Swap;