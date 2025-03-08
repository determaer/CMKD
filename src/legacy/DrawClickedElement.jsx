import React from 'react'
import DrawLabels from './DrawLabels'
import DrawLineBtwElements from './DrawLineBtwElements'

export default function ({
    clickedElement,
    params,
    x,
    y,
    flags,
    sizeMultiplier,
    scaleMultiplicator,
    setClickedElement,
    setClickedLine,
    labels,
    setActionItem,
    setClickedInfo,
    discNum,
    position,
}) {
    let labels1 = []
    let lines = []
    //let currentLabelAngles = params.angles.find(x => x.labelId === clickedElement.objLabel.id,)
    labels1.push(
        <DrawLabels
            x={x}
            y={y}
            params={params}
            flags={flags}
            sizeMultiplier={sizeMultiplier}
            objLabel={clickedElement.objLabel}
            scaleMultiplicator={scaleMultiplicator}
            shadowed={true}
            setActionItem={setActionItem}
            setClickedInfo={setClickedInfo}
            position={position}
        />
    )

    clickedElement.nextLabels.map((nLabel) => {
        //let nextLabelAngles = params.angles.find(x => x.labelId === nLabel.id)
        labels1.push(
            <DrawLabels
                x={x}
                y={y}
                params={params}
                flags={flags}
                sizeMultiplier={sizeMultiplier}
                objLabel={nLabel}
                scaleMultiplicator={scaleMultiplicator}
                setClickedElement={setClickedElement}
                setClickedLine={setClickedLine}
                labels={labels}
                setActionItem={setActionItem}
                setClickedInfo={setClickedInfo}
                position={position}
            />
        )
        lines.push(
            <DrawLineBtwElements
                x={x}
                y={y}
                params={params}
                objLabelIn={clickedElement.objLabel}
                objLabelOut={nLabel}
                scaleMultiplicator={scaleMultiplicator}
                flags={flags}
                setClickedLine={setClickedLine}
                setClickedElement={setClickedElement}
                setActionItem={setActionItem}
                setClickedInfo={setClickedInfo}
                discNum={discNum}
            />
        )
    })
    clickedElement.prevLabels.map((pLabel) => {
        //let prevLabelAngles = params.angles.find(x => x.labelId === pLabel.id)
        labels1.push(
            <DrawLabels
                x={x}
                y={y}
                params={params}
                flags={flags}
                sizeMultiplier={sizeMultiplier}
                objLabel={pLabel}
                scaleMultiplicator={scaleMultiplicator}
                setClickedElement={setClickedElement}
                setClickedLine={setClickedLine}
                labels={labels}
                setActionItem={setActionItem}
                setClickedInfo={setClickedInfo}
                position={position}
            />
        )
        lines.push(
            <DrawLineBtwElements
                x={x}
                y={y}
                params={params}
                objLabelIn={pLabel}
                objLabelOut={clickedElement.objLabel}
                scaleMultiplicator={scaleMultiplicator}
                flags={flags}
                setClickedLine={setClickedLine}
                setClickedElement={setClickedElement}
                setActionItem={setActionItem}
                setClickedInfo={setClickedInfo}
                discNum={discNum}
            />
        )
    })

    return (
        <>
            {lines}
            {labels1}
        </>
    )
}
