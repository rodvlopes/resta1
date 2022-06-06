import React from 'react'
import * as d3 from 'd3'

export default function useD3(renderChartFn: (el: any) => void, dependencies: any[]) {
  const ref = React.useRef()

  React.useEffect(() => {
    renderChartFn(d3.select(ref.current || ''))
    // return () => {}
  }, [renderChartFn, ...dependencies])

  return ref
}
