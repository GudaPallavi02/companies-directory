import './App.css';
import './index.css';

import React, { useState, useEffect, useMemo } from 'react';
import companiesData from './data/companies.json';

function App() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [sortCriteria, setSortCriteria] = useState('nameAsc');

  // Load companies
  useEffect(() => {
    setTimeout(() => {
      try {
        setCompanies(companiesData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load company data.");
        setLoading(false);
      }
    }, 1500);
  }, []);

  // ⚠️ ALL HOOKS MUST BE BEFORE ANY RETURN

  // Unique locations
  const uniqueLocations = useMemo(() => {
    return [...new Set(companies.map(c => c.location))];
  }, [companies]);

  // Filtering and sorting
  const filteredAndSortedCompanies = useMemo(() => {
    let list = [...companies];

    const search = searchTerm.trim().toLowerCase();
    if (search) {
      list = list.filter(company =>
        company.name.toLowerCase().includes(search)
      );
    }

    if (locationFilter !== 'All') {
      list = list.filter(company => company.location === locationFilter);
    }

    list.sort((a, b) => {
      switch (sortCriteria) {
        case 'nameAsc': return a.name.localeCompare(b.name);
        case 'nameDesc': return b.name.localeCompare(a.name);
        case 'employeesDesc': return b.employees - a.employees;
        case 'employeesAsc': return a.employees - b.employees;
        default: return 0;
      }
    });

    return list;
  }, [companies, searchTerm, locationFilter, sortCriteria]);

  // AFTER all hooks ➜ we can return JSX safely

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Loading companies...</h1>
        <p>Please wait a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className="container" style={{ background: 'black', border: '2px solid blue' }}>
      <h1 style={{ color: "blue", textAlign: 'center'}}> Companies Directory</h1>

      {/* FILTERS */}
      <div className="filter-controls" style={{
        marginBottom: '30px',
       textAlign: 'center',
        display: 'center',
        gap: '30px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search by Company name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', flexGrow: 1 }}
        />

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          style={{ padding: '8px'
           }}
        >
          <option value="All">Filter by Location (All)</option>
          {uniqueLocations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="nameAsc">Sort By: Name (A-Z)</option>
          <option value="nameDesc">Sort By: Name (Z-A)</option>
          <option value="employeesDesc">Sort By: Employees (High to Low)</option>
          <option value="employeesAsc">Sort By: Employees (Low to High)</option>
        </select>
      </div>

      <h2 style={{ textAlign: 'center'}}>Showing <b>{filteredAndSortedCompanies.length}</b> companies out of {companies.length} total.</h2>

      {/* COMPANY LIST */}
      <div className="companyList" style={{ marginTop: '20px'}}>
        {filteredAndSortedCompanies.map(company => (
          <div key={company.id} className="company-card" style={{
            border: '2px solid blue',
            background: 'black',
            padding: '15px',
            margin: '10px 0',
            borderRadius: '5px'
          }}>
            <h2>{company.name}</h2>
            <p><strong>Industry:</strong> {company.industry}</p>
            <p><strong>Location:</strong> {company.location}</p>
            <p><strong>Employees:</strong> {company.employees}</p>
          </div>
        ))}

        {filteredAndSortedCompanies.length === 0 && (
          <p style={{ textAlign: 'center' }}>No companies match your current filters.</p>
        )}
      </div>
    </div>
  );
}

export default App;


