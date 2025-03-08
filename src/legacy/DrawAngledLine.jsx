import React from 'react'
import * as Canvas from 'react-konva'
import { controlPoint } from './DrawCanvas'

export default function ({
    x,
    y,
    startRadius,
    endRadius,
    angle,
    color,
    width,
}) {
    let [startX, startY] = controlPoint(x, y, startRadius, angle)
    let [endX, endY] = controlPoint(x, y, endRadius, angle)
    return (
        <>
            <Canvas.Line
                points={[startX, startY, endX, endY]}
                stroke={color}
                strokeWidth={width}
            />
        </>
    )
}
