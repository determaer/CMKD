import DrawSector from './DrawSector'
import * as Canvas from 'react-konva'

export default function ({
    x,
    y,
    clickedSector,
    params,
    scaleMultiplicator,
    sizeMultiplier,
    flags,
    setClickedInfo,
    setClickedSector,
}) {
    return (
        <DrawSector
            x={x}
            y={y}
            sector={clickedSector.sector}
            params={params}
            bgColor={'gray'}
            scaleMultiplicator={scaleMultiplicator}
            sizeMultiplier={sizeMultiplier}
            flags={flags}
            setClickedInfo={setClickedInfo}
            setClickedSector={setClickedSector}
            opacity={0.5}
        />
    )
}
