import React from 'react'
import DrawLabels from './DrawLabels'
import DrawLineBtwElements from './DrawLineBtwElements'

export default function ({
    clickedLine,
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
    return (
        <>
            <DrawLabels
                x={x}
                y={y}
                params={params}
                flags={flags}
                sizeMultiplier={sizeMultiplier}
                scaleMultiplicator={scaleMultiplicator}
                objLabel={clickedLine.objLabelIn}
                setClickedElement={setClickedElement}
                setClickedLine={setClickedLine}
                labels={labels}
                setActionItem={setActionItem}
                setClickedInfo={setClickedInfo}
                position={position}
            />
            <DrawLabels
                x={x}
                y={y}
                params={params}
                flags={flags}
                sizeMultiplier={sizeMultiplier}
                objLabel={clickedLine.objLabelOut}
                scaleMultiplicator={scaleMultiplicator}
                setClickedElement={setClickedElement}
                setClickedLine={setClickedLine}
                labels={labels}
                setActionItem={setActionItem}
                setClickedInfo={setClickedInfo}
                position={position}
            />
            <DrawLineBtwElements
                x={x}
                y={y}
                params={params}
                objLabelIn={clickedLine.objLabelIn}
                objLabelOut={clickedLine.objLabelOut}
                scaleMultiplicator={scaleMultiplicator}
                flags={flags}
                setClickedElement={setClickedElement}
                setClickedLine={setClickedLine}
                setActionItem={setActionItem}
                setClickedInfo={setClickedInfo}
                discNum={discNum}
            />
        </>
    )
}
