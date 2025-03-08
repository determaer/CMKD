import React from 'react'
import * as Canvas from 'react-konva'
import {controlPoint} from './DrawCanvas'

export default function DrawSector({
    x,
    y,
    sector,
    params,
    bgColor,
    scaleMultiplicator,
    sizeMultiplier,
    flags,
    shadowed,
    setClickedInfo,
    setClickedSector,
    opacity,
}) {
    const [fill, setFill] = React.useState(bgColor)
    const [scale, setScale] = React.useState(1)
    let arcLength = sector.sEnd - sector.sStart
    let r = 0
    if (sector.sEnd - arcLength / 2 > 90 && sector.sEnd - arcLength / 2 < 270)
        r = 1
    const handleClick = (event) => {
        if (flags.oneLevel) {
            setClickedInfo({
                type: 'sector',
                id: sector.upperID,
            })
            setClickedSector({
                isClicked: true,
                sector: sector,
            })
        }

        //console.log('clicked sector of ' + sector.upperID)
    }
    const [labelX, labelY] = controlPoint(
        x,
        y,
        params.labelRadius + 50 * sector.sLevel * scaleMultiplicator,
        90 + (sector.sEnd - arcLength / 2)
    )
    let additional = 0
    if (flags.showSupportRect) {
        additional = 50
    }
    const [nameX, nameY] = controlPoint(
        x,
        y,
        params.sectorNameRadius + additional,
        90 + (sector.sEnd - arcLength / 2)
    )
    let fillColor = 'white'
    if (sector.objLabel) {
        if (sector.objLabel.score > 0) {
            fillColor = 'green'
        }
        if (sector.objLabel.score < 0) {
            fillColor = 'red'
        }
    }
    return (
        <>
            <Canvas.Arc
                x={x}
                y={y}
                angle={360 - arcLength}
                rotation={-90 - sector.sStart}
                outerRadius={
                    params.outerRadius + 50 * sector.sLevel * scaleMultiplicator
                }
                innerRadius={
                    params.innerRadius + 50 * sector.sLevel * scaleMultiplicator
                }
                fill={fill}
                stroke='black'
                opacity={opacity}
                onClick={handleClick}
                onMouseOver={() => {
                    setFill('gray')
                }}
                onMouseOut={() => {
                    setFill(bgColor)
                }}
                clockwise
                strokeWidth={2 * scaleMultiplicator}
            />
            {flags.showSectorName && (
                <>
                    <Canvas.Text
                        x={nameX}
                        y={nameY}
                        text={sector.shortname}
                        offset={{
                            x: 20 * sizeMultiplier * scale * scaleMultiplicator,
                            y: 10 * sizeMultiplier * scale * scaleMultiplicator,
                        }}
                        fontFamily='Times New Roman'
                        fontSize={
                            22 * sizeMultiplier * scale * scaleMultiplicator
                        }
                        onClick={handleClick}
                        onMouseOver={() => {
                            setFill('gray')
                        }}
                        onMouseOut={() => {
                            setFill(bgColor)
                        }}
                        rotation={-(sector.sEnd - arcLength / 2) - 180 * r}
                    />
                </>
            )}
            {sector.objLabel && sector.objLabel.isLabel && (
                <>
                    <Canvas.Rect
                        x={labelX}
                        y={labelY}
                        width={36 * sizeMultiplier * scale * scaleMultiplicator}
                        height={
                            36 * sizeMultiplier * scale * scaleMultiplicator
                        }
                        fill={'white'}
                        stroke={'black'}
                        strokeWidth={1 * scaleMultiplicator}
                        onClick={handleClick}
                        offset={{
                            x: 18 * sizeMultiplier * scale * scaleMultiplicator,
                            y: 18 * sizeMultiplier * scale * scaleMultiplicator,
                        }}
                        rotation={-(sector.sEnd - arcLength / 2)}
                        onMouseOver={() => {
                            setScale(1.5)
                        }}
                        onMouseOut={() => {
                            setScale(1)
                        }}
                    />
                    {flags.showScore && (
                        <Canvas.Rect
                            x={labelX}
                            y={labelY}
                            width={
                                36 * sizeMultiplier * scale * scaleMultiplicator
                            }
                            height={
                                36 * sizeMultiplier * scale * scaleMultiplicator
                            }
                            opacity={Math.abs(sector.objLabel.score)}
                            fill={shadowed ? 'white' : fillColor}
                            stroke={shadowed ? fillColor : 'black'}
                            strokeWidth={1 * scaleMultiplicator}
                            onClick={handleClick}
                            offset={{
                                x:
                                    18 *
                                    sizeMultiplier *
                                    scale *
                                    scaleMultiplicator,
                                y:
                                    18 *
                                    sizeMultiplier *
                                    scale *
                                    scaleMultiplicator,
                            }}
                            rotation={-(sector.sEnd - arcLength / 2)}
                            onMouseOver={() => {
                                setScale(1.5)
                            }}
                            onMouseOut={() => {
                                setScale(1)
                            }}
                        />
                    )}
                    <Canvas.Text
                        x={labelX}
                        y={labelY}
                        text={sector.objLabel.typeText}
                        offset={{
                            x: 13 * sizeMultiplier * scale * scaleMultiplicator,
                            y: 10 * sizeMultiplier * scale * scaleMultiplicator,
                        }}
                        fontFamily='Times New Roman'
                        fontSize={
                            22 * sizeMultiplier * scale * scaleMultiplicator
                        }
                        onClick={handleClick}
                        onMouseOver={() => {
                            setScale(1.5)
                        }}
                        onMouseOut={() => {
                            setScale(1)
                        }}
                        fontStyle={sector.objLabel.fontStyle}
                    />
                    <Canvas.Text
                        x={labelX}
                        y={labelY}
                        text={sector.objLabel.numText}
                        offset={{
                            x: 1 * sizeMultiplier * scale * scaleMultiplicator,
                            y: 2 * sizeMultiplier * scale * scaleMultiplicator,
                        }}
                        fontFamily='Times New Roman'
                        fontSize={
                            16 * sizeMultiplier * scale * scaleMultiplicator
                        }
                        onClick={handleClick}
                        onMouseOver={() => {
                            setScale(1.5)
                        }}
                        onMouseOut={() => {
                            setScale(1)
                        }}
                        fontStyle={sector.objLabel.fontStyle}
                    />
                </>
            )}
            {sector.objLabel && !sector.objLabel.isLabel && (
                <>
                    <Canvas.Text
                        x={labelX}
                        y={labelY}
                        text={
                            sector.objLabel.typeText + sector.objLabel.numText
                        }
                        offset={{
                            x: 20 * sizeMultiplier * scale * scaleMultiplicator,
                            y: 10 * sizeMultiplier * scale * scaleMultiplicator,
                        }}
                        fontFamily='Times New Roman'
                        fontSize={
                            22 * sizeMultiplier * scale * scaleMultiplicator
                        }
                        onClick={handleClick}
                        onMouseOver={() => {
                            setFill('gray')
                        }}
                        onMouseOut={() => {
                            setFill(bgColor)
                        }}
                        rotation={-(sector.sEnd - arcLength / 2) - 180 * r}
                        fontStyle={sector.objLabel.fontStyle}
                    />
                </>
            )}
        </>
    )
}
