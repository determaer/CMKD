import React from 'react'
import * as Canvas from 'react-konva'
import DrawLabels from './DrawLabels'
import DrawLineBtwElements from './DrawLineBtwElements'
import DrawBase from './DrawBase'
import DrawClickedElement from './DrawClickedElement'
import DrawClickedLine from './DrawClickedLine'
import DrawClickedSector from './DrawClickedSector'
//import { labels } from '../data/labels'

export default function ({
    scaleMultiplier,
    drawingMode,
    labels,
    setActionItem,
    setClickedInfo,
    setDownload,
    download,
    redFlags,
    oneLevel,
    dialogSized,
    position,
    extShowSupportRect,
    showImportant,
}) {
    const stageRef = React.useRef(null)
    React.useEffect(() => {
        if (download) {
            let dataURL = stageRef.current.toDataURL({pixelRatio: 10})
            downloadURI(dataURL, 'stage.png')
            setDownload(false)
        }
    }, [download])

    const [xCenter, setXCenter] = React.useState(400)
    const [yCenter, setYCenter] = React.useState(600)
    const [width, setWidth] = React.useState(800)
    const [height, setHeight] = React.useState(800)
    const [clickLayerX, setClickLayerX] = React.useState(-1000)
    const [clickLayerY, setClickLayerY] = React.useState(-1000)
    const [discNum, setDiscNum] = React.useState(0)
    const [circleNum, setCircleNum] = React.useState(0)
    const [labelsZero, setLabelsZero] = React.useState([])
    const circleDivider = 5
    const pointNum = discNum * circleDivider

    const [scaleMultiplicator, setScaleMultiplicator] =
        React.useState(scaleMultiplier)
    const [sizeMultiplier, setSizeMultiplier] = React.useState(1)

    const [showSupportRect, setShowSupportRect] =
        React.useState(extShowSupportRect)
    const [showAdditionalInCircle, setShowAdditionalInCircle] =
        React.useState(true)
    const [defaultRect, setDefaultRect] = React.useState(true)
    const [showScore, setShowScore] = React.useState(false)
    const [showLight, setShowLight] = React.useState(false)
    const [showSectorName, setShowSectorName] = React.useState(false)

    const [clickedLine, setClickedLine] = React.useState({
        isClicked: false,
        objLabelIn: null,
        objLabelOut: null,
    })

    const [clickedElement, setClickedElement] = React.useState({
        isClicked: false,
        objLabel: null, //содержит внутри объекта id элементов далее
        prevLabels: null, //стрелка к ним
        nextLabels: null, //стрелка от них
    })
    const [clickedSector, setClickedSector] = React.useState({
        isClicked: false,
        sector: null,
    })
    //
    const [params, setParams] = React.useState({
        outerRadius: 0, //внешний радиус окружности диаграммы
        innerRadius: 0, //внутренний радиус окружности диаграммы
        labelRadius: 0, //радиус расположения элементов
        additionalLabelRadius: 0, //радиус расположения дополнительных элементов
        linesBtwElementsRadius: 0, //радиус конечных точек для линий-соединителей
        mergingPortsRadius: 0, //радиус на котором начинается слияние портов элемента
        angles: [],
        dividerAngles: [],
    })

    React.useEffect(() => {
        if (dialogSized) {
            setXCenter(xCenter / 2.2)
            setYCenter(yCenter / 2.2)
            setWidth(width / 2.2)
            setHeight(height / 2.2)
            setClickLayerX(0)
            setClickLayerY(0)
        }
    }, [dialogSized])

    React.useEffect(() => {
        if (drawingMode == 'score' || drawingMode == 'light') {
            setShowSupportRect(extShowSupportRect)
        }
    }, [extShowSupportRect])

    React.useEffect(() => {
        if (drawingMode == 'default') {
            setShowSupportRect(false)
            setShowAdditionalInCircle(true)
            setShowScore(false)
            setDefaultRect(false)
            setShowLight(false)
            if (oneLevel) setShowSectorName(true)
        }
        if (drawingMode == 'default+') {
            setShowSupportRect(true)
            setShowAdditionalInCircle(false)
            setShowScore(false)
            setDefaultRect(false)
            setShowLight(false)
            if (oneLevel) setShowSectorName(true)
        }
        if (drawingMode == 'score') {
            if (!extShowSupportRect) setShowSupportRect(false)
            setShowAdditionalInCircle(false)
            setShowScore(true)
            setDefaultRect(false)
            setShowLight(false)
            if (oneLevel) setShowSectorName(true)
        }
        if (drawingMode == 'light') {
            if (!extShowSupportRect) setShowSupportRect(false)
            setShowAdditionalInCircle(false)
            setShowScore(true)
            setDefaultRect(false)
            setShowLight(true)
            if (oneLevel) setShowSectorName(true)
        }
    }, [drawingMode])

    React.useEffect(() => {
        setScaleMultiplicator(scaleMultiplier)
    }, [scaleMultiplier])

    React.useEffect(() => {
        let t = 0
        let tLevel = 0
        let labelsZeroLevel = []
        for (let i = 0; i < labels.length; i = i + 1) {
            if (labels[i].level > tLevel) tLevel = labels[i].level
            if (labels[i].level == 0) {
                t = t + 1
                labelsZeroLevel.push(labels[i])
            }
        }
        setCircleNum(tLevel)
        setDiscNum(t)
        setLabelsZero(labelsZeroLevel)
    }, [])
    React.useEffect(() => {
        if (discNum <= 10) setSizeMultiplier(1)
        if (discNum > 10 && discNum < 20) {
            setSizeMultiplier(0.9)
        }
        if (discNum >= 20 && discNum < 30) {
            setSizeMultiplier(0.8)
        }
        if (discNum >= 30 && discNum < 40) {
            setSizeMultiplier(0.75)
        }
        if (discNum >= 40 && discNum < 50) {
            setSizeMultiplier(0.7)
        }
        if (discNum >= 50) {
            setSizeMultiplier(0.65)
        }
    }, [discNum])

    React.useEffect(() => {}, [sizeMultiplier])

    React.useEffect(() => {
        setXCenter(width / 2)
        setYCenter(height / 2)
    }, [width, height])

    React.useEffect(() => {
        let arrLabelAngles = [],
            arrInAngles = [],
            arrOutAngles = [],
            arrArrowsAngles = [],
            arrDividerAngles = []
        for (let i = 1; i <= discNum * 2; i = i + 2) {
            let t = i * (360 / (discNum * 2)) + 90
            arrLabelAngles.push(t)
        }
        for (let i = 1; i < pointNum; i = i + circleDivider) {
            let tIn = (i + 1) * (360 / pointNum) + 90 //+ (4 - 4 ** sizeMultiplier)
            let tOut = (i + 2) * (360 / pointNum) + 90 //- (4 - 4 ** sizeMultiplier)
            let tArrow = tIn - 2 * sizeMultiplier
            arrArrowsAngles.push(tArrow)
            arrInAngles.push(tOut)
            arrOutAngles.push(tIn)
        }
        let arrAngles = []
        for (let i = 0; i < discNum; i = i + 1) {
            arrAngles.push({
                labelId: labelsZero[i].index,
                inAngle: arrInAngles[i],
                outAngle: arrOutAngles[i],
                labelAngle: arrLabelAngles[i],
                arrowAngle: arrArrowsAngles[i],
            })
        }
        arrDividerAngles.push(90)
        for (let i = 0; i < discNum - 1; i = i + 1) {
            if (labelsZero[i].prop !== labelsZero[i + 1].prop) {
                arrDividerAngles.push(
                    arrLabelAngles[i] +
                        (arrLabelAngles[i + 1] - arrLabelAngles[i]) / 2
                )
            }
        }

        setParams({
            outerRadius:
                discNum < 50
                    ? 250 * scaleMultiplicator
                    : 300 * scaleMultiplicator,
            innerRadius:
                discNum < 50
                    ? 200 * scaleMultiplicator
                    : 250 * scaleMultiplicator,
            labelRadius:
                discNum < 50
                    ? 225 * scaleMultiplicator
                    : 275 * scaleMultiplicator,
            additionalLabelRadius:
                discNum < 50
                    ? 285 * scaleMultiplicator
                    : 335 * scaleMultiplicator,
            linesBtwElementsRadius:
                discNum < 50
                    ? 190 * scaleMultiplicator
                    : 240 * scaleMultiplicator,
            mergingPortsRadius:
                discNum < 50
                    ? 212 * scaleMultiplicator
                    : 262 * scaleMultiplicator,
            sectorNameRadius:
                discNum < 50
                    ? 265 * scaleMultiplicator
                    : 315 * scaleMultiplicator,
            dividerAngles: arrDividerAngles,
            angles: arrAngles,
        })
    }, [scaleMultiplicator, sizeMultiplier])
    let sectors = []
    for (let i = circleNum; i >= 0; i = i - 1) {
        let sectorsAngles = []
        let sectorsLabels = []
        let currentAngle = 0
        sectorsAngles.push(0)
        if (params.angles.length > 0) {
            if (i == 0) {
                let sectorsAngles = []
                let sectorsLabels = []
                let start, end1, upperID, shortname
                sectorsAngles.push(0)
                if (params.angles.length > 0) {
                    labelsZero.map((label) => {
                        if (label.secStart) {
                            start = label.index
                            upperID = label.object.parent_id
                            shortname = label.sectorName
                        }

                        if (label.secEnd) {
                            end1 = label.index
                            sectorsLabels.push({
                                sStartLID: start,
                                sEndLID: end1,
                                upperID: upperID,
                                sLevel: 0,
                                shortname: shortname,
                            })
                            start = null
                            end1 = null
                            let end = label.index
                            if (end != labels.length - 1) {
                                // console.log(end)
                                let angle1 = params.angles.find(
                                    (lAngle) => lAngle.labelId === end + 1
                                ).labelAngle
                                let angle2 = params.angles.find(
                                    (lAngle) => lAngle.labelId === end
                                ).labelAngle
                                let angle = angle2 + (angle1 - angle2) / 2
                                sectorsAngles.push(angle - 90)
                            }
                        }
                    })
                }
                sectorsAngles.push(360)

                if (sectorsLabels.length > 0)
                    for (let i = 0; i < sectorsAngles.length - 1; i = i + 1) {
                        sectors.push({
                            sStart: sectorsAngles[i],
                            sEnd: sectorsAngles[i + 1],
                            sStartLID: sectorsLabels[i].sStartLID,
                            sEndLID: sectorsLabels[i].sEndLID,
                            sLevel: sectorsLabels[i].sLevel,
                            upperID: sectorsLabels[i].upperID,
                            shortname: sectorsLabels[i].shortname,
                        })
                    }
            } else {
                labels.map((label) => {
                    if (label.level == i) {
                        sectorsAngles.push(
                            currentAngle + 360 * (label.secLength / discNum)
                        )
                        currentAngle =
                            currentAngle + 360 * (label.secLength / discNum)
                        sectorsLabels.push({
                            sStartLID: label.index,
                            sEndLID: label.index,
                            sLevel: i,
                            objLabel: label,
                            upperID: label.object.parent_id,
                        })
                    }
                })
            }
            if (sectorsLabels.length > 0)
                for (let i = 0; i < sectorsAngles.length - 1; i = i + 1) {
                    sectors.push({
                        sStart: sectorsAngles[i],
                        sEnd: sectorsAngles[i + 1],
                        sStartLID: sectorsLabels[i].sStartLID,
                        sEndLID: sectorsLabels[i].sEndLID,
                        sLevel: sectorsLabels[i].sLevel,
                        objLabel: sectorsLabels[i].objLabel,
                        upperID: sectorsLabels[i].upperID,
                    })
                }
        }
    }

    let lines = []
    labelsZero.map((label, from) => {
        if (label.connections.length !== 0) {
            // if (
            //     (showLight && label.score < 0 && label.isBase == true) ||
            //     !showLight
            // )
            label.connections.map((to) => {
                if (labels.some((elem) => elem.id == to))
                    if (
                        (showLight &&
                            (redFlags.some((elem_id) => elem_id == to) ||
                                (label.score < 0 && label.isBase == true))) ||
                        !showLight ||
                        (oneLevel && label.drawAnyCase)
                    )
                        lines.push(
                            <DrawLineBtwElements
                                x={xCenter}
                                y={yCenter}
                                params={params}
                                objLabelOut={labelsZero[from]}
                                objLabelIn={labelsZero.find((x) => x.id === to)}
                                setClickedElement={setClickedElement}
                                setClickedLine={setClickedLine}
                                scaleMultiplicator={scaleMultiplicator}
                                flags={{
                                    showScore: showScore,
                                    showLight: showLight,
                                    oneLevel: oneLevel,
                                    showImportant: showImportant,
                                }}
                                setActionItem={setActionItem}
                                setClickedInfo={setClickedInfo}
                                discNum={discNum}
                                position={position}
                            />
                        )
            })
        }
    })

    if (params.angles.length > 0) {
        return (
            <Canvas.Stage
                //draggable
                scale={scaleMultiplicator}
                width={width}
                height={height}
                ref={stageRef}
                onClick={() => {
                    console.log('www')
                }}>
                <Canvas.Layer>
                    <Canvas.Rect
                        fill={'white'}
                        x={xCenter - width}
                        y={yCenter - height}
                        width={width * scaleMultiplicator * 3}
                        height={height * scaleMultiplicator * 3}
                    />
                    <DrawBase
                        x={xCenter}
                        y={yCenter}
                        params={params}
                        scaleMultiplicator={scaleMultiplicator}
                        sizeMultiplier={sizeMultiplier}
                        sectors={sectors}
                        bgColor={'#dad0f1'}
                        bgColor2={'#e8e8e8'}
                        circleNum={circleNum}
                        flags={{
                            showScore: showScore,
                            showSectorName: showSectorName,
                            oneLevel: oneLevel,
                            showSupportRect: showSupportRect,
                        }}
                        setClickedInfo={setClickedInfo}
                        setClickedSector={setClickedSector}
                    />

                    {lines}
                    <DrawArrows
                        params={params}
                        labels={labelsZero}
                        flags={{
                            showSupportRect: showSupportRect,
                            showAdditionalInCircle: showAdditionalInCircle,
                        }}
                        x={xCenter}
                        y={yCenter}
                        sizeMultiplier={sizeMultiplier}
                        scaleMultiplicator={scaleMultiplicator}
                    />
                    {labelsZero.map((label, index) => {
                        return (
                            <DrawLabels
                                x={xCenter}
                                y={yCenter}
                                params={params}
                                objLabel={label}
                                flags={{
                                    showSupportRect: showSupportRect,
                                    showAdditionalInCircle:
                                        showAdditionalInCircle,
                                    defaultRect: defaultRect,
                                    showScore: showScore,
                                    showLight: showLight,
                                }}
                                sizeMultiplier={sizeMultiplier}
                                setClickedElement={setClickedElement}
                                setClickedLine={setClickedLine}
                                labels={labelsZero}
                                scaleMultiplicator={scaleMultiplicator}
                                setActionItem={setActionItem}
                                setClickedInfo={setClickedInfo}
                                position={position}
                            />
                        )
                    })}
                </Canvas.Layer>
                {(clickedElement.isClicked ||
                    clickedLine.isClicked ||
                    clickedSector.isClicked) && (
                    <Canvas.Layer>
                        <Canvas.Rect
                            fill={'white'}
                            x={clickLayerX}
                            y={clickLayerY}
                            width={width * scaleMultiplicator * 3}
                            height={height * scaleMultiplicator * 3}
                            onClick={() => {
                                setClickedElement({isClicked: false})
                                setClickedLine({isClicked: false})
                                setClickedInfo(null)
                                setClickedSector({isClicked: false})
                            }}
                            opacity={0.6}
                        />
                        {clickedElement.isClicked && (
                            <DrawClickedElement
                                clickedElement={clickedElement}
                                params={params}
                                x={xCenter}
                                y={yCenter}
                                flags={{
                                    showSupportRect: showSupportRect,
                                    showAdditionalInCircle:
                                        showAdditionalInCircle,
                                    defaultRect: defaultRect,
                                    showScore: showScore,
                                    showLight: showLight,
                                    oneLevel: oneLevel,
                                }}
                                sizeMultiplier={sizeMultiplier}
                                scaleMultiplicator={scaleMultiplicator}
                                setClickedElement={setClickedElement}
                                setClickedLine={setClickedLine}
                                labels={labelsZero}
                                setActionItem={setActionItem}
                                setClickedInfo={setClickedInfo}
                                discNum={discNum}
                                position={position}
                            />
                        )}
                        {clickedLine.isClicked && (
                            <DrawClickedLine
                                clickedLine={clickedLine}
                                params={params}
                                x={xCenter}
                                y={yCenter}
                                flags={{
                                    showSupportRect: showSupportRect,
                                    showAdditionalInCircle:
                                        showAdditionalInCircle,
                                    defaultRect: defaultRect,
                                    showScore: showScore,
                                    showLight: showLight,
                                    oneLevel: oneLevel,
                                }}
                                sizeMultiplier={sizeMultiplier}
                                scaleMultiplicator={scaleMultiplicator}
                                setClickedElement={setClickedElement}
                                setClickedLine={setClickedLine}
                                labels={labelsZero}
                                setActionItem={setActionItem}
                                setClickedInfo={setClickedInfo}
                                discNum={discNum}
                                position={position}
                            />
                        )}
                        {clickedSector.isClicked && (
                            <DrawClickedSector
                                x={xCenter}
                                y={yCenter}
                                clickedSector={clickedSector}
                                params={params}
                                bgColor={'gray'}
                                scaleMultiplicator={scaleMultiplicator}
                                sizeMultiplier={sizeMultiplier}
                                flags={{
                                    showSupportRect: showSupportRect,
                                    showAdditionalInCircle:
                                        showAdditionalInCircle,
                                    defaultRect: defaultRect,
                                    showScore: showScore,
                                    showLight: showLight,
                                }}
                                setClickedInfo={setClickedInfo}
                                setClickedSector={setClickedSector}
                            />
                        )}
                    </Canvas.Layer>
                )}
            </Canvas.Stage>
        )
    }
}

function controlPoint(x, y, radius, angle) {
    var radians = (angle / 180) * Math.PI
    var controlX = x + radius * Math.cos(radians)
    var controlY = y - radius * Math.sin(radians)
    return [controlX, controlY]
}

function DrawArrows({
    labels,
    x,
    y,
    params,
    sizeMultiplier,
    scaleMultiplicator,
    flags,
}) {
    const handleClick = () => {
        console.log('clicked arrow btw elements')
    }
    let arrowsInLabels = []
    let arcBtwLabels = []
    labels.map((label, index) => {
        if (label.arrowIn) {
            let lAngle = params.angles.find(
                (lAngle) => lAngle.labelId === label.index
            )
            let startAngle = lAngle.arrowAngle - 1
            let endAngle = lAngle.arrowAngle
            let [startX, startY] = controlPoint(
                x,
                y,
                params.labelRadius,
                startAngle
            )
            let [endX, endY] = controlPoint(x, y, params.labelRadius, endAngle)
            if (flags.showAdditionalInCircle || label.isBase)
                arrowsInLabels.push(
                    <Canvas.Arrow
                        points={[startX, startY, endX, endY]}
                        stroke='black'
                        fill='black'
                        pointerWidth={7 * sizeMultiplier * scaleMultiplicator}
                        pointerLength={7 * scaleMultiplicator}
                        onClick={handleClick}
                    />
                )
        }
        if (label.arrowOut) {
            let startAngle = params.angles.find(
                (lAngle) => lAngle.labelId === label.index
            ).labelAngle

            let endAngle = params.angles.find(
                (lAngle) => lAngle.labelId === labels[index + 1].index
            ).labelAngle

            arcBtwLabels.push(
                <Canvas.Arc
                    x={x}
                    y={y}
                    stroke={'black'}
                    angle={startAngle - endAngle} //startAngle - endAngle
                    innerRadius={params.labelRadius}
                    outerRadius={params.labelRadius}
                    clockwise
                    rotation={-startAngle} //-startAngle
                    onClick={handleClick}
                    strokeWidth={2 * scaleMultiplicator}
                />
            )
        }
    })
    if (arcBtwLabels.length > 0)
        return (
            <>
                {arrowsInLabels}
                {arcBtwLabels}
            </>
        )
}

function downloadURI(uri, name) {
    var link = document.createElement('a')
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
