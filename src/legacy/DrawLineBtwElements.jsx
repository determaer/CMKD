import React from 'react'
import * as Canvas from 'react-konva'
import {controlPoint} from './DrawCanvas'

export default function ({
    x,
    y,
    params,
    objLabelOut,
    objLabelIn,
    setClickedLine,
    setClickedElement,
    scaleMultiplicator,
    flags,
    setActionItem,
    setClickedInfo,
    discNum,
    position,
}) {
    let radiusCorrection = 0
    if (discNum >= 50) radiusCorrection = 1
    let bezierCPangle1, bezierCPangle2
    let bezierCPX1, bezierCPY1, bezierCPX2, bezierCPY2
    let outAngle, inAngle, outRadius, inRadius
    if (objLabelIn.prop !== 0 || objLabelOut.prop !== 0) {
        inRadius = params.innerRadius
        outRadius = params.linesBtwElementsRadius
        outAngle = params.angles.find(
            (lAngle) => lAngle.labelId === objLabelOut.index
        ).inAngle
        inAngle = params.angles.find(
            (lAngle) => lAngle.labelId === objLabelIn.index
        ).outAngle
    } else {
        outRadius = params.innerRadius
        inRadius = params.linesBtwElementsRadius
        outAngle = params.angles.find(
            (lAngle) => lAngle.labelId === objLabelOut.index
        ).outAngle
        inAngle = params.angles.find(
            (lAngle) => lAngle.labelId === objLabelIn.index
        ).inAngle
    }

    let diff = Math.abs(outAngle - inAngle)
    if (outAngle >= 300) outAngle = outAngle - 360
    if (inAngle >= 300) inAngle = inAngle - 360
    let radius
    if (diff < 180) {
        let t = (180 - diff) / 10
        diff = diff / 250
        radius =
            10 * t * scaleMultiplicator +
            50 * radiusCorrection * scaleMultiplicator
        bezierCPangle1 = outAngle + diff
        bezierCPangle2 = inAngle - diff
    }
    if (diff >= 180) {
        let t = (180 - Math.abs(diff - 360)) / 10
        diff = diff / 250
        radius =
            10 * t * scaleMultiplicator +
            50 * radiusCorrection * scaleMultiplicator
        bezierCPangle1 = outAngle - diff
        bezierCPangle2 = inAngle + diff
    }

    ;[bezierCPX1, bezierCPY1] = controlPoint(x, y, radius, bezierCPangle1)
    ;[bezierCPX2, bezierCPY2] = controlPoint(x, y, radius, bezierCPangle2)

    const [outX, outY] = controlPoint(x, y, outRadius, outAngle)
    const [inX, inY] = controlPoint(x, y, inRadius, inAngle)
    const handleClick = (event) => {
        setScale(1)
        setClickedElement({isClicked: false})
        setClickedLine({
            isClicked: true,
            objLabelIn: objLabelIn,
            objLabelOut: objLabelOut,
        })
        setActionItem({
            type: 'LineOnClick',
            objLabelIn: objLabelIn,
            objLabelOut: objLabelOut,
        })
        setClickedInfo({
            type: 'line',
            objLabelIn: objLabelIn,
            objLabelOut: objLabelOut,
        })
    }

    let draw = true
    if (position) {
        if (objLabelIn.index > position) draw = false
    }

    let stroke = 'black'
    if (flags.showImportant) {
        if (objLabelOut.score < 0) stroke = 'red'
        if (objLabelIn.score < 0 && objLabelOut.isBase) {
            stroke = 'red'
        }
    }

    const [scale, setScale] = React.useState(1)
    return (
        <>
            {draw && (
                <Canvas.Line
                    bezier
                    points={[
                        outX,
                        outY,
                        bezierCPX1,
                        bezierCPY1,
                        bezierCPX2,
                        bezierCPY2,
                        inX,
                        inY,
                    ]}
                    stroke={stroke}
                    strokeWidth={2.2 * scale * scaleMultiplicator}
                    onClick={handleClick}
                    onMouseOver={() => {
                        setScale(3)
                        setActionItem({
                            type: 'LineOnMouseOver',
                            objLabelIn: objLabelIn,
                            objLabelOut: objLabelOut,
                        })
                    }}
                    onMouseOut={() => {
                        setScale(1)
                        setActionItem(null)
                    }}
                    dash={
                        (objLabelIn.prop !== 0 || objLabelOut.prop !== 0) &&
                        !flags.oneLevel && [5, 2]
                    }
                />
            )}
        </>
    )
}
