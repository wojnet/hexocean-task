import React, { FormEvent, useState } from "react";
import axios from "axios";

const DishForm: React.FC = () => {

    type DishTypes = "pizza" | "soup" | "sandwich";
    type SpicinessRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

    interface IRequestBody {
        name: string;
        preparation_time: string;
        type: string;
        no_of_slices?: number;
        diameter?: number;
        spiciness_scale?: number;
        slices_of_bread?: number;
    }

    const [name, setName] = useState<string>("");
    const [preparationTime, setPreparationTime] = useState<string>("");
    const [type, setType] = useState<DishTypes>("pizza");
    const [noOfSlices, setNoOfSlices] = useState<number>(0);
    const [diameter, setDiameter] = useState<number>(0);
    const [spicinessScale, setSpicinessScale] = useState<SpicinessRange>(1);
    const [slicesOfBread, setSlicesOfBread] = useState<number>(0);
 
    const requestUrl: string = "https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/";

    const resetData = () => {
        setName("");
        setPreparationTime("");
        setNoOfSlices(0);
        setDiameter(0);
        setSpicinessScale(1);
        setSlicesOfBread(0);
    }

    const submitData = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        var requestBody: IRequestBody = {
            name,
            preparation_time: preparationTime,
            type,
        }

        switch(type) {
            case "pizza":
                requestBody["no_of_slices"] = noOfSlices;
                requestBody["diameter"] = diameter;
                break;
            case "soup":
                requestBody["spiciness_scale"] = spicinessScale;
                break;
            case "sandwich":
                requestBody["slices_of_bread"] = slicesOfBread;
                break;
        }

        axios.post(requestUrl, requestBody,
            { headers: { 'Content-Type': 'application/json' } })
            .then(response => {
                console.log(response.data);
                resetData();
            })
            .catch(error => {
                let errorKeys: string[] = Object.keys(error.response.data);
                let errorArray: string[] = [];
                errorKeys.forEach(key => {
                    errorArray.push(`Error in '${key}':\n${error.response.data[key]}`);
                });
                alert(errorArray.join("\n\n"));
            });
    }

    return (
        <div className="DishForm">
            <h1>DISHES</h1>
            <form onSubmit={submitData}>
                <label htmlFor="name">Dish name:</label>
                <input 
                    type="text"
                    id="name"
                    value={name}
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        setName(event.currentTarget.value);
                    }}
                    required
                /> 

                <label htmlFor="preparation_time">Preparation time:</label>
                <input
                    type="text"
                    placeholder="hh:mm:ss"
                    id="preparation_time"
                    minLength={8}
                    maxLength={8}
                    pattern="([0][0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]"
                    value={preparationTime}
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        setPreparationTime(event.currentTarget.value);
                    }}
                    required 
                /> 

                <label htmlFor="type">Type:</label>
                <select
                    id="type"
                    required
                    value={type}
                    onChange={(event: React.FormEvent<HTMLSelectElement>) => {
                        setType(event.currentTarget.value as DishTypes);
                    }}
                >
                    <option value="pizza">🍕 Pizza</option>
                    <option value="soup">🍲 Soup</option>
                    <option value="sandwich">🥪 Sandwich</option>
                </select>

                {/* CONDITIONAL FIELDS */}
                { type === "pizza" &&
                    <>
                        <label htmlFor="no_of_slices">Number of slices:</label>
                        <input
                            type="number"
                            id="no_of_slices"
                            value={noOfSlices ? noOfSlices : ""}
                            onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                setNoOfSlices(parseInt(event.currentTarget.value));
                            }}
                            required 
                        />

                        <label htmlFor="diameter">Diameter:</label>
                        <input
                            type="number"
                            id="diameter"
                            step="0.1"
                            min={0}
                            value={diameter ? diameter : ""}
                            onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                let value: number = parseFloat(event.currentTarget.value);
                                if (value < 0) value = 0;
                                setDiameter(value);
                            }}
                            required 
                        /> 
                    </>
                }

                { type === "soup" &&
                    <>
                        <label htmlFor="spiciness_scale">Spiciness scale (1-10):</label>
                        <input
                            type="number"
                            id="spiciness_scale"
                            min={1}
                            max={10}
                            value={spicinessScale ? spicinessScale : ""}
                            onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                let value: SpicinessRange = parseInt(event.currentTarget.value) as SpicinessRange;
                                if (value > 10) value = 10;
                                if (value < 1) value = 1;
                                setSpicinessScale(value);
                            }}
                            required 
                        /> 
                    </>
                }

                { type === "sandwich" &&
                    <>
                        <label htmlFor="slices_of_bread">Slices of bread:</label>
                        <input
                            type="number"
                            id="slices_of_bread"
                            min={1}
                            max={10}
                            value={slicesOfBread ? slicesOfBread : ""}
                            onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                setSlicesOfBread(parseInt(event.currentTarget.value));
                            }}
                            required 
                        /> 
                    </>
                }

                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default DishForm;