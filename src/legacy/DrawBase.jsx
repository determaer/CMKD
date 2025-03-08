import React from 'react'
import * as Canvas from 'react-konva'
import DrawSector from './DrawSector'
import DrawAngledLine from './DrawAngledLine'
export default function ({
    x,
    y,
    params,
    scaleMultiplicator,
    sizeMultiplier,
    bgColor,
    bgColor2,
    sectors,
    circleNum,
    flags,
    setClickedInfo,
    setClickedSector,
}) {
    let drawSectors = []
    let drawDivider = []
    sectors.map(sector => {
        drawSectors.push(
            <DrawSector
                x={x}
                y={y}
                sector={sector}
                params={params}
                bgColor={sector.sLevel % 2 === 0 ? bgColor : bgColor2}
                scaleMultiplicator={scaleMultiplicator}
                sizeMultiplier={sizeMultiplier}
                flags={flags}
                setClickedInfo={setClickedInfo}
                setClickedSector={setClickedSector}
            />,
        )
    })
    params.dividerAngles.map(dAngle => {
        drawDivider.push(
            <TypeDivider
                x={x}
                y={y}
                startRadius={params.innerRadius}
                endRadius={
                    params.outerRadius + 50 * circleNum * scaleMultiplicator
                }
                angle={dAngle}
                scaleMultiplicator={scaleMultiplicator}
            />,
        )
    })

    return (
        <>
            {drawSectors}
            {drawDivider}
        </>
    )
}

function TypeDivider({
    x,
    y,
    startRadius,
    endRadius,
    angle,
    scaleMultiplicator,
}) {
    return (
        <>
            <DrawAngledLine
                x={x}
                y={y}
                startRadius={startRadius}
                endRadius={endRadius}
                angle={angle}
                color={'black'}
                width={5 * scaleMultiplicator}
            />
            <DrawAngledLine
                x={x}
                y={y}
                startRadius={startRadius - 2}
                endRadius={endRadius + 2}
                angle={angle}
                color={'white'}
                width={2 * scaleMultiplicator}
            />
        </>
    )
}
