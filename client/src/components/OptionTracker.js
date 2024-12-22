import React, { useState, useEffect } from "react";
import "./OptionTracker.css";
import axios from "axios";

const OptionTracker = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({
    name: "",
    currentPrice: "",
    vestedPrice: "",
    datesAndShares: [],
  });
  const [dateShareInput, setDateShareInput] = useState({ date: "", shares: "" });
  const [autocompleteResults, setAutocompleteResults] = useState([]);

  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;

  // Placeholder example company
  useEffect(() => {
    const exampleCompany = {
      name: "Example Inc.",
      currentPrice: "150.00",
      vestedPrice: "100.00",
      datesAndShares: [
        { date: "2024-01-01", shares: "50" },
        { date: "2024-04-01", shares: "100" },
        { date: "2024-07-01", shares: "150" },
        { date: "2024-10-01", shares: "200" },
      ],
    };
    setCompanies([exampleCompany]);
  }, []);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setNewCompany({ ...newCompany, [name]: value });

    if (name === "name" && value.length > 1) {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${API_KEY}`
        );
        setAutocompleteResults(response.data.bestMatches || []);
      } catch (error) {
        console.error("Error fetching autocomplete:", error);
      }
    }
  };

  const handleAutocompleteSelect = async (symbol, name) => {
    setNewCompany({ ...newCompany, name });

    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );
      const price = response.data["Global Quote"]?.["05. price"] || "N/A";
      setNewCompany((prev) => ({
        ...prev,
        currentPrice: parseFloat(price).toFixed(2),
      }));
    } catch (error) {
      console.error("Error fetching stock price:", error);
    }

    setAutocompleteResults([]);
  };

  const addDateAndShares = () => {
    if (dateShareInput.date && dateShareInput.shares) {
      setNewCompany((prev) => ({
        ...prev,
        datesAndShares: [...prev.datesAndShares, { ...dateShareInput }],
      }));
      setDateShareInput({ date: "", shares: "" });
    }
  };

  const addCompany = () => {
    if (
      newCompany.name &&
      newCompany.vestedPrice &&
      newCompany.datesAndShares.length > 0
    ) {
      setCompanies([...companies, newCompany]);
      setNewCompany({ name: "", currentPrice: "", vestedPrice: "", datesAndShares: [] });
    }
  };

  const deleteCompany = (index) => {
    setCompanies((prev) => prev.filter((_, i) => i !== index));
  };

  const calculatePotentialProfit = (vestedPrice, currentPrice, shares) => {
    return ((currentPrice - vestedPrice) * shares).toFixed(2);
  };

  const calculateCurrentShares = (datesAndShares) => {
    const now = new Date();
    return datesAndShares.reduce((total, { date, shares }) => {
      const shareDate = new Date(date);
      return shareDate <= now ? total + parseInt(shares) : total;
    }, 0);
  };

  const calculateCurrentValue = (currentShares, currentPrice) => {
    return (currentShares * currentPrice).toFixed(2);
  };

  return (
    <div className="option-tracker-container">
      <h2>Stock Option & Equity Tracker</h2>
      <div className="dashboard-grid">
        {/* Add Company Block */}
        <div className="add-company-block">
          <h3>Add a Company</h3>
          <div className="form-group">
            <label>Company Name:</label>
            <input
              type="text"
              name="name"
              value={newCompany.name}
              onChange={handleInputChange}
              placeholder="Search company..."
            />
            {autocompleteResults.length > 0 && (
              <ul className="autocomplete-dropdown">
                {autocompleteResults.map((item, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      handleAutocompleteSelect(item["1. symbol"], item["2. name"])
                    }
                  >
                    {item["2. name"]} ({item["1. symbol"]})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label>Vested Price:</label>
            <input
              type="number"
              name="vestedPrice"
              value={newCompany.vestedPrice}
              onChange={(e) =>
                setNewCompany({ ...newCompany, vestedPrice: e.target.value })
              }
              placeholder="Enter vested price..."
            />
          </div>
          <div className="form-group">
            <label>Dates & Shares:</label>
            <input
              type="date"
              name="date"
              value={dateShareInput.date}
              onChange={(e) =>
                setDateShareInput({ ...dateShareInput, date: e.target.value })
              }
            />
            <input
              type="number"
              name="shares"
              value={dateShareInput.shares}
              onChange={(e) =>
                setDateShareInput({ ...dateShareInput, shares: e.target.value })
              }
              className="shares-input"
              placeholder="Enter shares..."
            />
          </div>
          <button onClick={addDateAndShares} className="add-dates-button">
            Add Dates & Shares
          </button>
          <button onClick={addCompany} className="add-company-button">
            Add Company
          </button>
          <div className="dates-and-shares-display">
            {newCompany.datesAndShares.map((ds, i) => (
              <div key={i} className="small-info-block">
                <p>{ds.date}</p>
                <p>{ds.shares} shares</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company Blocks */}
        {companies.map((company, index) => {
          const currentShares = calculateCurrentShares(company.datesAndShares);
          const potentialProfit = calculatePotentialProfit(
            company.vestedPrice,
            company.currentPrice,
            currentShares
          );
          const currentValue = calculateCurrentValue(
            currentShares,
            company.currentPrice
          );

          return (
            <div key={index} className="company-block">
              <button
                className="delete-button"
                onClick={() => deleteCompany(index)}
              >
                X
              </button>
              <h3>{company.name}</h3>
              <div className="company-info">
                <div className="info-block">
                  <h4>Dates & Shares</h4>
                  {company.datesAndShares.map((ds, i) => (
                    <div key={i} className="small-info-block centered-block">
                      <p>{ds.date}</p>
                      <p>{ds.shares} shares</p>
                    </div>
                  ))}
                </div>
                <div className="info-block centered-block">
                  <h4>Prices</h4>
                  <div className="small-info-block">
                    <p>Vested Price</p>
                    <p>${company.vestedPrice}</p>
                  </div>
                  <div className="small-info-block">
                    <p>Current Price</p>
                    <p>${company.currentPrice}</p>
                  </div>
                </div>
                <div className="info-block">
                  <h4>Potential Profit</h4>
                  <p style={{ color: potentialProfit > 0 ? "green" : "red" }}>
                    ${potentialProfit}
                  </p>
                </div>
                <div className="info-block">
                  <h4>Current Shares & Value</h4>
                  <div className="small-info-block centered-block">
                    <p>{currentShares} shares</p>
                  </div>
                  <div className="small-info-block centered-block">
                    <p>${currentValue}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OptionTracker;
