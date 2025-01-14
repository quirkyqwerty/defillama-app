import React, { useState, useMemo, useEffect, useRef } from 'react'
import { ResponsiveContainer } from 'recharts'
import { timeframeOptions } from '../../constants'
import TradingViewChart, { CHART_TYPES } from '../TradingviewChart'
import { getTimeframe } from '../../utils'
//import { useNFTChartData } from '../../contexts/NFTData'

const GlobalNFTChart = ({ chartData, dailyVolume, dailyVolumeChange, unit = "", symbol = "" }) => {
  // time window and window size for chart
  const timeWindow = timeframeOptions.ALL_TIME

  // update the width on a window resize
  const ref = useRef()
  const isClient = typeof window === 'object'
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
  useEffect(() => {
    if (!isClient) {
      return false
    }
    function handleResize() {
      setWidth(ref?.current?.container?.clientWidth ?? width)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isClient, width]) // Empty array ensures that effect is only run on mount and unmount

  const filteredChartData = chartData.map(({ date, dailyVolume }) => [date, dailyVolume])

  return filteredChartData ? (
    <ResponsiveContainer aspect={60 / 28} ref={ref}>
      <TradingViewChart
        data={filteredChartData}
        base={dailyVolume}
        baseChange={dailyVolumeChange}
        title={`Daily Volume ${symbol}`}
        field="1"
        width={width}
        type={CHART_TYPES.AREA}
        units={unit}
      />
    </ResponsiveContainer>
  ) : (
    ''
  )
}

export default GlobalNFTChart
