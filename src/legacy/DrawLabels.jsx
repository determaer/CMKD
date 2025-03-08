import React from 'react'
import * as Canvas from 'react-konva'
import {controlPoint} from './DrawCanvas'
export default function ({
    x,
    y,
    params,
    objLabel,
    flags,
    sizeMultiplier,
    scaleMultiplicator,
    setClickedElement,
    setClickedLine,
    labels,
    shadowed,
    setActionItem,
    setClickedInfo,
    position,
}) {
    let lAngle = params.angles.find(
        (lAngle) => lAngle.labelId === objLabel.index
    )
    const [labelX, labelY] = controlPoint(
        x,
        y,
        params.labelRadius,
        lAngle.labelAngle
    )
    const [inInnerX, inInnerY] = controlPoint(
        x,
        y,
        params.innerRadius,
        lAngle.inAngle
    )
    const [outInnerX, outInnerY] = controlPoint(
        x,
        y,
        params.innerRadius,
        lAngle.outAngle
    )
    const [outMergingX, outMergingY] = controlPoint(
        x,
        y,
        params.mergingPortsRadius,
        lAngle.outAngle
    )
    const [inMergingX, inMergingY] = controlPoint(
        x,
        y,
        params.mergingPortsRadius,
        lAngle.inAngle
    )
    const [supLabelX, supLabelY] = controlPoint(
        x,
        y,
        params.additionalLabelRadius,
        lAngle.labelAngle
    )
    const [arrowX, arrowY] = controlPoint(
        x,
        y,
        params.innerRadius - 1,
        lAngle.inAngle
    )

    const [labelX2, labelY2] = controlPoint(
        x,
        y,
        params.labelRadius + 2.5,
        lAngle.labelAngle + 0.6
    )
    const [labelX3, labelY3] = controlPoint(
        x,
        y,
        params.labelRadius + 5,
        lAngle.labelAngle + 1.2
    )
    const [supLabelX2, supLabelY2] = controlPoint(
        x,
        y,
        params.additionalLabelRadius + 2.5,
        lAngle.labelAngle + 0.6
    )
    const [supLabelX3, supLabelY3] = controlPoint(
        x,
        y,
        params.additionalLabelRadius + 5,
        lAngle.labelAngle + 1.2
    )

    const handleClick = (event) => {
        setScale(1)
        let arrPrevLabels = []
        let arrNextLabels = []
        labels.map((label) => {
            if (label.connections.length !== 0) {
                label.connections.map((connection) => {
                    if (objLabel.id === connection) {
                        arrPrevLabels.push(label)
                    }
                })
            }
        })
        objLabel.connections.map((connection) => {
            let label = labels.find((label) => label.id === connection)
            if (label != undefined) arrNextLabels.push(label)
        })
        setClickedLine({isClicked: false})
        console.log(objLabel, arrNextLabels, arrPrevLabels)
        setClickedElement({
            isClicked: true,
            objLabel: objLabel,
            prevLabels: arrNextLabels,
            nextLabels: arrPrevLabels,
        })
        setActionItem({
            type: 'LabelOnClick',
            objLabel: objLabel,
        })
        setClickedInfo({
            type: 'label',
            objLabel: objLabel,
            prevLabels: arrNextLabels,
            nextLabels: arrPrevLabels,
        })
    }

    const handleHover = () => {}

    let fillColor = 'white'
    if (flags.showScore) {
        if (objLabel.grey) {
            fillColor = 'lightgrey'
        } else {
            if (objLabel.score > 0) {
                fillColor = 'green'
            } else if (objLabel.score < 0) {
                fillColor = 'red'
            }
        }
        if (objLabel.index > position) fillColor = 'yellow'
    }

    const [scale, setScale] = React.useState(1)

    return (
        <>
            <Canvas.Line
                points={[
                    inInnerX,
                    inInnerY,
                    inMergingX,
                    inMergingY,
                    labelX,
                    labelY,
                    outMergingX,
                    outMergingY,
                    outInnerX,
                    outInnerY,
                ]}
                stroke='black'
                strokeWidth={2 * scaleMultiplicator}
                lineJoin='round'
            />
            <Canvas.Arrow
                points={[arrowX, arrowY, inInnerX, inInnerY]}
                stroke='black'
                fill='black'
                pointerWidth={10 * sizeMultiplier * scaleMultiplicator}
                pointerLength={10 * scaleMultiplicator}
            />
            {flags.showSupportRect &&
                (objLabel.num > 1 ||
                    (!objLabel.isBase && !flags.showAdditionalInCircle)) && (
                    <DrawSupportLabel
                        labelX={labelX}
                        labelY={labelY}
                        supLabelX={supLabelX}
                        supLabelY={supLabelY}
                        supLabelX2={supLabelX2}
                        supLabelY2={supLabelY2}
                        supLabelX3={supLabelX3}
                        supLabelY3={supLabelY3}
                        sizeMultiplier={sizeMultiplier}
                        scaleMultiplicator={scaleMultiplicator}
                        angles={lAngle}
                        objLabel={objLabel}
                        flags={flags}
                        setActionItem={setActionItem}
                    />
                )}
            {(objLabel.type === 'rect' ||
                objLabel.type === 'roundrect' ||
                flags.defaultRect) &&
                (flags.showAdditionalInCircle || objLabel.isBase) && (
                    <>
                        {objLabel.num > 2 &&
                            !flags.showSupportRect &&
                            !flags.showScore && (
                                <>
                                    <Canvas.Rect
                                        x={labelX3}
                                        y={labelY3}
                                        width={
                                            36 *
                                            sizeMultiplier *
                                            scale *
                                            scaleMultiplicator
                                        }
                                        height={
                                            36 *
                                            sizeMultiplier *
                                            scale *
                                            scaleMultiplicator
                                        }
                                        fill={
                                            objLabel.learnt
                                                ? 'white'
                                                : fillColor
                                        }
                                        stroke='black'
                                        strokeWidth={1 * scaleMultiplicator}
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
                                        rotation={-lAngle.labelAngle}
                                        onClick={handleClick}
                                        cornerRadius={
                                            objLabel.type === 'roundrect' &&
                                            !flags.defaultRect
                                                ? 7
                                                : 0
                                        }
                                        onMouseOver={() => {
                                            setScale(1.5)
                                            setActionItem({
                                                type: 'LabelOnMouseOver',
                                                objLabel: objLabel,
                                            })
                                        }}
                                        onMouseOut={() => {
                                            setScale(1)
                                            setActionItem(null)
                                        }}
                                    />
                                </>
                            )}

                        {objLabel.num > 1 &&
                            !flags.showSupportRect &&
                            !flags.showScore && (
                                <>
                                    <Canvas.Rect
                                        x={labelX2}
                                        y={labelY2}
                                        width={
                                            36 *
                                            sizeMultiplier *
                                            scale *
                                            scaleMultiplicator
                                        }
                                        height={
                                            36 *
                                            sizeMultiplier *
                                            scale *
                                            scaleMultiplicator
                                        }
                                        fill={'white'}
                                        stroke='black'
                                        strokeWidth={1 * scaleMultiplicator}
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
                                        rotation={-lAngle.labelAngle}
                                        onClick={handleClick}
                                        cornerRadius={
                                            objLabel.type === 'roundrect' &&
                                            !flags.defaultRect
                                                ? 7
                                                : 0
                                        }
                                        onMouseOver={() => {
                                            setScale(1.5)
                                            setActionItem({
                                                type: 'LabelOnMouseOver',
                                                objLabel: objLabel,
                                            })
                                        }}
                                        onMouseOut={() => {
                                            setScale(1)
                                            setActionItem(null)
                                        }}
                                    />
                                </>
                            )}

                        <Canvas.Rect
                            x={labelX}
                            y={labelY}
                            width={
                                36 * sizeMultiplier * scale * scaleMultiplicator
                            }
                            height={
                                36 * sizeMultiplier * scale * scaleMultiplicator
                            }
                            fill={objLabel.learnt ? 'white' : fillColor}
                            stroke={'black'}
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
                            rotation={-lAngle.labelAngle}
                            cornerRadius={
                                objLabel.type === 'roundrect' &&
                                !flags.defaultRect
                                    ? 7
                                    : 0
                            }
                            onMouseOver={() => {
                                setScale(1.5)
                                setActionItem({
                                    type: 'LabelOnMouseOver',
                                    objLabel: objLabel,
                                })
                            }}
                            onMouseOut={() => {
                                setScale(1)
                                setActionItem(null)
                            }}
                        />
                        {flags.showScore && (
                            <Canvas.Rect
                                x={labelX}
                                y={labelY}
                                width={
                                    36 *
                                    sizeMultiplier *
                                    scale *
                                    scaleMultiplicator
                                }
                                height={
                                    36 *
                                    sizeMultiplier *
                                    scale *
                                    scaleMultiplicator
                                }
                                opacity={
                                    fillColor === 'lightgrey' || shadowed
                                        ? 1
                                        : Math.abs(objLabel.score)
                                }
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
                                rotation={-lAngle.labelAngle}
                                cornerRadius={
                                    objLabel.type === 'roundrect' &&
                                    !flags.defaultRect
                                        ? 7
                                        : 0
                                }
                                onMouseOver={() => {
                                    setScale(1.5)
                                    setActionItem({
                                        type: 'LabelOnMouseOver',
                                        objLabel: objLabel,
                                    })
                                }}
                                onMouseOut={() => {
                                    setScale(1)
                                    setActionItem(null)
                                }}
                            />
                        )}
                    </>
                )}
            {objLabel.type === 'circle' &&
                !flags.defaultRect &&
                (flags.showAdditionalInCircle || objLabel.isBase) && (
                    <>
                        {objLabel.num > 2 &&
                            !flags.showSupportRect &&
                            !flags.showScore && (
                                <>
                                    <Canvas.Circle
                                        x={labelX3}
                                        y={labelY3}
                                        radius={
                                            20 *
                                            sizeMultiplier *
                                            scale *
                                            scaleMultiplicator
                                        }
                                        fill={
                                            objLabel.learnt
                                                ? 'white'
                                                : fillColor
                                        }
                                        stroke='black'
                                        strokeWidth={1 * scaleMultiplicator}
                                        onClick={handleClick}
                                        onMouseOver={() => {
                                            setScale(1.5)
                                            setActionItem({
                                                type: 'LabelOnMouseOver',
                                                objLabel: objLabel,
                                            })
                                        }}
                                        onMouseOut={() => {
                                            setScale(1)
                                            setActionItem(null)
                                        }}
                                    />
                                </>
                            )}
                        {objLabel.num > 1 &&
                            !flags.showSupportRect &&
                            !flags.showScore && (
                                <>
                                    <Canvas.Circle
                                        x={labelX2}
                                        y={labelY2}
                                        radius={
                                            20 *
                                            sizeMultiplier *
                                            scale *
                                            scaleMultiplicator
                                        }
                                        fill={
                                            objLabel.learnt
                                                ? 'white'
                                                : fillColor
                                        }
                                        stroke='black'
                                        strokeWidth={1 * scaleMultiplicator}
                                        onClick={handleClick}
                                        onMouseOver={() => {
                                            setScale(1.5)
                                            setActionItem({
                                                type: 'LabelOnMouseOver',
                                                objLabel: objLabel,
                                            })
                                        }}
                                        onMouseOut={() => {
                                            setScale(1)
                                            setActionItem(null)
                                        }}
                                    />
                                </>
                            )}
                        <Canvas.Circle
                            x={labelX}
                            y={labelY}
                            radius={
                                20 * sizeMultiplier * scale * scaleMultiplicator
                            }
                            fill={objLabel.learnt ? 'white' : fillColor}
                            stroke={'black'}
                            strokeWidth={1 * scaleMultiplicator}
                            onClick={handleClick}
                            onMouseOver={() => {
                                setScale(1.5)
                                setActionItem({
                                    type: 'LabelOnMouseOver',
                                    objLabel: objLabel,
                                })
                            }}
                            onMouseOut={() => {
                                setScale(1)
                                setActionItem(null)
                            }}
                        />
                        {flags.showScore && (
                            <Canvas.Circle
                                x={labelX}
                                y={labelY}
                                radius={
                                    20 *
                                    sizeMultiplier *
                                    scale *
                                    scaleMultiplicator
                                }
                                fill={shadowed ? 'white' : fillColor}
                                stroke={shadowed ? fillColor : 'black'}
                                strokeWidth={1 * scaleMultiplicator}
                                opacity={Math.abs(objLabel.score)}
                                onClick={handleClick}
                                onMouseOver={() => {
                                    setScale(1.5)
                                    setActionItem({
                                        type: 'LabelOnMouseOver',
                                        objLabel: objLabel,
                                    })
                                }}
                                onMouseOut={() => {
                                    setScale(1)
                                    setActionItem(null)
                                }}
                            />
                        )}
                    </>
                )}
            {(flags.showAdditionalInCircle || objLabel.isBase) && (
                <>
                    <Canvas.Text
                        x={labelX}
                        y={labelY}
                        text={objLabel.typeText}
                        offset={{
                            x: 14 * sizeMultiplier * scale * scaleMultiplicator,
                            y: 10 * sizeMultiplier * scale * scaleMultiplicator,
                        }}
                        fontFamily='Times New Roman'
                        fontSize={
                            objLabel.typeText.length === 1
                                ? 22 *
                                  sizeMultiplier *
                                  scale *
                                  scaleMultiplicator
                                : 15 *
                                  sizeMultiplier *
                                  scale *
                                  scaleMultiplicator
                        }
                        onClick={handleClick}
                        onMouseOver={() => {
                            setScale(1.5)
                            setActionItem({
                                type: 'LabelOnMouseOver',
                                objLabel: objLabel,
                            })
                        }}
                        onMouseOut={() => {
                            setScale(1)
                            setActionItem(null)
                        }}
                        fontStyle={objLabel.fontStyle}
                    />
                    <Canvas.Text
                        x={labelX}
                        y={labelY}
                        text={objLabel.numText}
                        offset={{
                            x: 3 * sizeMultiplier * scale * scaleMultiplicator,
                            y: 4 * sizeMultiplier * scale * scaleMultiplicator,
                        }}
                        fontFamily='Times New Roman'
                        fontSize={
                            16 * sizeMultiplier * scale * scaleMultiplicator
                        }
                        onClick={handleClick}
                        onMouseOver={() => {
                            setScale(1.5)
                            setActionItem({
                                type: 'LabelOnMouseOver',
                                objLabel: objLabel,
                            })
                        }}
                        onMouseOut={() => {
                            setScale(1)
                            setActionItem(null)
                        }}
                        fontStyle={objLabel.fontStyle}
                    />
                </>
            )}
        </>
    )
}

function DrawSupportLabel({
    labelX,
    labelY,
    supLabelX,
    supLabelY,
    supLabelX2,
    supLabelY2,
    supLabelX3,
    supLabelY3,
    sizeMultiplier,
    scaleMultiplicator,
    angles,
    objLabel,
    flags,
    setActionItem,
}) {
    const [scale, setScale] = React.useState(1)

    const handleClick = (event) => {
        setScale(1)
    }

    return (
        <>
            <Canvas.Line
                points={[labelX, labelY, supLabelX, supLabelY]}
                stroke='black'
            />
            {objLabel.num > 3 ||
            (objLabel.num > 2 &&
                !objLabel.isBase &&
                !flags.showAdditionalInCircle) ? (
                <Canvas.Rect
                    x={supLabelX3}
                    y={supLabelY3}
                    width={36 * sizeMultiplier * scale * scaleMultiplicator}
                    height={36 * sizeMultiplier * scale * scaleMultiplicator}
                    fill='white'
                    stroke='black'
                    strokeWidth={1 * scaleMultiplicator}
                    offset={{
                        x: 18 * sizeMultiplier * scale * scaleMultiplicator,
                        y: 18 * sizeMultiplier * scale * scaleMultiplicator,
                    }}
                    rotation={-angles.labelAngle}
                    onClick={handleClick}
                    onMouseOver={() => {
                        setScale(1.5)
                        setActionItem({
                            type: 'SupportOnMouseOver',
                            objLabel: objLabel,
                        })
                    }}
                    onMouseOut={() => {
                        setScale(1)
                        setActionItem(null)
                    }}
                />
            ) : null}
            {objLabel.num > 2 ||
            (objLabel.num > 1 &&
                !objLabel.isBase &&
                !flags.showAdditionalInCircle) ? (
                <Canvas.Rect
                    x={supLabelX2}
                    y={supLabelY2}
                    width={36 * sizeMultiplier * scale * scaleMultiplicator}
                    height={36 * sizeMultiplier * scale * scaleMultiplicator}
                    fill='white'
                    stroke='black'
                    strokeWidth={1 * scaleMultiplicator}
                    offset={{
                        x: 18 * sizeMultiplier * scale * scaleMultiplicator,
                        y: 18 * sizeMultiplier * scale * scaleMultiplicator,
                    }}
                    rotation={-angles.labelAngle}
                    onClick={handleClick}
                    onMouseOver={() => {
                        setScale(1.5)
                        setActionItem({
                            type: 'SupportOnMouseOver',
                            objLabel: objLabel,
                        })
                    }}
                    onMouseOut={() => {
                        setScale(1)
                        setActionItem(null)
                    }}
                />
            ) : null}
            <Canvas.Rect
                x={supLabelX}
                y={supLabelY}
                width={36 * sizeMultiplier * scale * scaleMultiplicator}
                height={36 * sizeMultiplier * scale * scaleMultiplicator}
                fill='white'
                stroke='black'
                strokeWidth={1 * scaleMultiplicator}
                offset={{
                    x: 18 * sizeMultiplier * scale * scaleMultiplicator,
                    y: 18 * sizeMultiplier * scale * scaleMultiplicator,
                }}
                rotation={-angles.labelAngle}
                onClick={handleClick}
                onMouseOver={() => {
                    setScale(1.5)
                    setActionItem({
                        type: 'SupportOnMouseOver',
                        objLabel: objLabel,
                    })
                }}
                onMouseOut={() => {
                    setScale(1)
                    setActionItem(null)
                }}
            />
            <Canvas.Text
                x={supLabelX}
                y={supLabelY}
                text={objLabel.typeText}
                offset={{
                    x: 13 * sizeMultiplier * scale * scaleMultiplicator,
                    y: 10 * sizeMultiplier * scale * scaleMultiplicator,
                }}
                fontFamily='Times New Roman'
                fontSize={22 * sizeMultiplier * scale * scaleMultiplicator}
                onClick={handleClick}
                onMouseOver={() => {
                    setScale(1.5)
                    setActionItem({
                        type: 'SupportOnMouseOver',
                        objLabel: objLabel,
                    })
                }}
                onMouseOut={() => {
                    setScale(1)
                    setActionItem(null)
                }}
                fontStyle={objLabel.fontStyle}
            />
            <Canvas.Text
                x={supLabelX}
                y={supLabelY}
                text={objLabel.numText}
                offset={{
                    x: 1 * sizeMultiplier * scale * scaleMultiplicator,
                    y: 2 * sizeMultiplier * scale * scaleMultiplicator,
                }}
                fontFamily='Times New Roman'
                fontSize={16 * sizeMultiplier * scale * scaleMultiplicator}
                onClick={handleClick}
                onMouseOver={() => {
                    setScale(1.5)
                    setActionItem({
                        type: 'SupportOnMouseOver',
                        objLabel: objLabel,
                    })
                }}
                onMouseOut={() => {
                    setScale(1)
                    setActionItem(null)
                }}
                fontStyle={objLabel.fontStyle}
            />
        </>
    )
}
