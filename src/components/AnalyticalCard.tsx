import React from 'react'
import Card from './Card'
import CircularProgressBar from './CircularProgressBar'

function AnalyticalCard({progressInPercentages}:any) {
  return (
    <Card>
        <CircularProgressBar progressInPercentages={progressInPercentages}/>
    </Card>
  )
}

export default AnalyticalCard