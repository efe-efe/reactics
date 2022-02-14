//TODO: Delete when creating a real one and this one no longer serves as reference
import React from 'react'
import { RootState } from '../../store'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../slices/counterSlice'
import Styles from "./styles.module.css"; 

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <Panel className={Styles.counter}>
        <Button onactivate={() => dispatch(increment())}>
            <Label text="Increment"/>
        </Button>
        <Label text={count}/>
        <Button onactivate={() => dispatch(decrement())}>
            <Label text="Decrement"/>
        </Button>
    </Panel>
  )
}

export default Counter;