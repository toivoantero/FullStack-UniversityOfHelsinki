import { useCounterControls } from '../store'

const Buttons = () => {
  const { plusGood, plusNeutral, plusBad } = useCounterControls()

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={plusGood}>good</button>
      <button onClick={plusNeutral}>neutral</button>
      <button onClick={plusBad}>bad</button>
    </div>
  )
}

export default Buttons
