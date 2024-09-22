import './App.css';
import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [jsonInput, setJsonInput] = useState("");
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleInputChange = (e) => {
        setJsonInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const parsedInput = JSON.parse(jsonInput);

            // Prepare the data to send
            const dataToSend = {
                data: parsedInput.data // Ensure this matches your expected structure
            };

            const response = await axios.post("http://localhost:5000/bfhl", dataToSend);
            setResponseData(response.data);
        } catch (err) {
            console.error(err);
            setError("Invalid JSON input or API error");
            if (err.response) {
                setError(err.response.data.message || err.response.data);
            }
        }
    };

    const handleOptionChange = (e) => {
        const { options } = e.target;
        const selectedValues = [];
        for (const option of options) {
            if (option.selected) {
                selectedValues.push(option.value);
            }
        }
        setSelectedOptions(selectedValues);
    };

    const renderFilteredResponse = () => {
        if (!responseData) return null;

        const filteredResponse = [];

        if (selectedOptions.includes("Alphabets")) {
            filteredResponse.push(`Alphabets: ${responseData.alphabets.join(", ")}`);
        }
        if (selectedOptions.includes("Numbers")) {
            filteredResponse.push(`Numbers: ${responseData.numbers.join(", ")}`);
        }
        if (selectedOptions.includes("Highest Lowercase Alphabet")) {
            filteredResponse.push(`Highest Lowercase Alphabet: ${responseData.highest_lowercase_alphabet}`);
        }

        return (
            <div>
                <h3>Filtered Response:</h3>
                {filteredResponse.map((item, index) => (
                    <p key={index}>{item}</p>
                ))}
            </div>
        );
    };

    return (
        <div>
            <h1>Enter the data</h1>

            <form onSubmit={handleSubmit}>
                <label>Enter JSON:</label>
                <textarea
                    value={jsonInput}
                    onChange={handleInputChange}
                    placeholder='Enter JSON data'
                    rows='6'
                    cols='50'
                ></textarea>
                <br />
                <button type='submit'>Submit</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {responseData && (
                <div>
                    <h2>Response Data:</h2>
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>

                    <h3>Select Data to Display:</h3>
                    <select multiple onChange={handleOptionChange}>
                        <option value='Alphabets'>Alphabets</option>
                        <option value='Numbers'>Numbers</option>
                        <option value='Highest Lowercase Alphabet'>Highest Lowercase Alphabet</option>
                    </select>

                    {renderFilteredResponse()}
                </div>
            )}
        </div>
    );
};

export default App;
