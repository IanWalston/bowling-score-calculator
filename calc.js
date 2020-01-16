const urlParams = new URLSearchParams(window.location.search);
const scoreSequence = urlParams.get("sequence");

const calculateScore = frames => {
    let totalScore = 0;

    const framesArray = frames.split("-");

    const framesObjectArray = framesArray.map(frameThrows => {

        let throws = frameThrows.split("")    

        return {
            throws: throws,
            frameThrowsTotal: 0,
            bonusTotal: 0
        }
    });

    //find in frame total for each frame excuding tenth frame
    for (let i in framesObjectArray) {
        let obj = framesObjectArray[i];
            for (let i in obj.throws){
                if (obj.throws[i] === 'X'){
                    obj.frameThrowsTotal += 10
                } else if (obj.throws[i] === '/'){
                    obj.frameThrowsTotal += 10 - parseInt(obj.throws[parseInt(i)-1])
                } else {
                    obj.frameThrowsTotal += parseInt(obj.throws[i])
                }
            }
    }

    //find bonus for each frame excluding tenth frame
    for (let i in framesObjectArray) {
        let obj = framesObjectArray[i];

        if (i === "9") {
            break;
        }

        if (obj.throws.includes("X") || obj.throws.includes("/")) {
            let next_obj = framesObjectArray[parseInt(i) + 1];
            console.log(next_obj);
            continue;
        }
    }


    framesObjectArray.forEach(frame =>{
        totalScore += frame.frameThrowsTotal
    })

    console.log(framesObjectArray)

    return totalScore;
};

$("#sequence").val(scoreSequence);

$("#scoreDisplay").html(calculateScore(scoreSequence));

if (!scoreSequence)
    $('<p class="text-muted" />').html(
        "The calculated total score for the game will be displayed here when you submit the card above."
    );
