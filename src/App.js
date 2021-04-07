import './App.css';
import React, {useCallback, useEffect, useRef, useState} from "react";

const THRESHOLD = 4;
function App() {
    const [carNames, setCarNames] = useState([]);
    const [newCarNames, setNewCarNames] = useState("");
    const [gameTurns, setGameTurns] = useState();
    const [winners, setWinners] = useState([]);
    const [racingInfo, setRacingInfo] = useState([]);
    const inputRef = useRef(null);

    const handleCarNameInput = function () {
        console.log("handleCarNames");
        const newCarNamesArr = newCarNames.split(",");
        setCarNames(() => newCarNamesArr);
    }
    const onChangeNewCarNames = function ({target}) {
        console.log("handleCarNames", target.value);
        setNewCarNames(target.value);
    }
    const handleChangeGameTurns = function () {
        console.log("handleChangeGameTurns");
        setRacingInfo([]);
        startRacing();
    }
    const startRacing = function () {
        console.log("startRacing");
        const current = inputRef.current.value;
        setGameTurns(current);
    }
    const createNewRacingInto = useCallback(function () {
        const prevRacingInfo = racingInfo.length > 0 ? racingInfo[racingInfo.length - 1] : null;
        const newRacingInfo = carNames.map((name, index) => {
            const prevPosition = prevRacingInfo ? prevRacingInfo[index].position : 0;
            const position = getRandomNumBetween0to9() >= THRESHOLD ? prevPosition + 1 : prevPosition;
            const display = `🏎️${"💨".repeat(position)}`;
            return {name, position, display};
        });
        setGameTurns(gameTurns => gameTurns - 1);
        setRacingInfo((racingInfo) => [...racingInfo, newRacingInfo]);
    }, [racingInfo, carNames]);

    const getRandomNumBetween0to9 = function () {
        return Math.floor(Math.random() * 10);
    }

    useEffect(() => {
        if (gameTurns > 0) {
            createNewRacingInto();
        } else if (racingInfo.length > 0 && gameTurns === 0) {
            const result = racingInfo[racingInfo.length - 1];
            const maxPosition = result.reduce(function (max, car) {
                return car.position > max ? car.position : max
            }, 0);
            const winners = result.filter(car => car.position === maxPosition);
            setWinners(winners);
        }
    }, [gameTurns, createNewRacingInto, racingInfo]);

    return (
        <div className="App">
            <div className="Center">
                🏎️ 자동차 경주 게임<br/>
                자동차 이름을 5자 이하로 콤마로 구분하여 입력해주세요<br/>
                올바른 예) east,west,south,north<br/>
                <input type="text" value={newCarNames} onChange={(e) => onChangeNewCarNames(e)}/>
                <button onClick={handleCarNameInput}>확인</button>
                <br/>
                <br/>
                {
                    carNames.length > 0 && <>
                        시도할 횟수를 입력해주세요
                        <br/>
                        <input type="number" ref={inputRef}/>
                        <button onClick={handleChangeGameTurns}> 확인</button>
                    </>
                }
            </div>
            {
                racingInfo.length > 0 && racingInfo.map((turn, index) => {
                    return <div key={index}>
                        {
                            turn.map((info) => {
                                return <RacingView key={info.name} name={info.name} display={info.display}/>
                            })
                        }
                        <br/>
                    </div>
                })
            }
            {
                winners.length > 0 &&
                <div>
                    최종우승자: {winners.map(winner => winner.name).join(",")}
                </div>
            }
        </div>
    );
}

function RacingView({name, display}) {
    return (
        <div key={name}>
            <span>{display} : {name}</span>
        </div>
    );
}

export default App;
