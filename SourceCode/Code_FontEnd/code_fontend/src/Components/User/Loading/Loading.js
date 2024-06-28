import React from 'react'
import "./Loading.css"
import { Col, Container, Row, Spinner } from 'react-bootstrap'
export default function Loading() {
  return (
    <Container>
        <Row>
            <Col className='loading-from-all'>
               <h3>Loading  
               <Spinner animation="grow" variant="danger" size="sm"/>
               <Spinner animation="grow" variant="danger" size="sm"/>
               <Spinner animation="grow" variant="danger" size="sm"/>
               <Spinner animation="grow" variant="danger" size="sm"/>
               </h3>
            </Col>
        </Row>
    </Container>
  )
}
