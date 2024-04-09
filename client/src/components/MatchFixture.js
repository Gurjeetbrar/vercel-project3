import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import Alert from '@mui/material/Alert';
import useMediaQuery from "@mui/material/useMediaQuery";
import { width } from '@mui/system';
const MatchFixture = () => {
  const location = useLocation();
  const state = location.state;
  const [teams, setTeams] = useState([]); // Renamed state to 'teams'
  const [match, setMatch] = useState(null);
  const [fixtures, setFixtures] = useState([]); // Moved 'fixtures' state here
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const backendUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; 
  useEffect(() => {
    fetchMatch();
  }, []);

  useEffect(() => {
    // Regenerate fixtures whenever the 'teams' state is updated
    setFixtures(generateFixtures(teams));
  }, [teams]);

  const fetchMatch = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/allmatches/getmatches`,
        {
          method: "GET",
          headers: {
            "match-id": state.matchId,
          },
        }
      );
      const data = await response.json();
      setMatch(data.match);

      if (data.match && data.match.Teams.length > 0) {
        setTeams(data.match.Teams.map((team) => team.name));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const styles = {
    container: {
      
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize:isSmallScreen?"10px": '18px',
      margin:isSmallScreen?"6rem 0 3rem": '8rem 0 5rem',
      fontFamily: '"Helvetica Neue", sans-serif'
    },
    heading: {
      marginBottom: '20px',
      color: '#333',
      fontSize:isSmallScreen?"1rem": '24px',
      fontWeight: 'bold'
    },
    knockoutFixture: {
      width:isSmallScreen?"80%":"40%",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f5f5f5'
    },
    fixtureMatch: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      padding: '10px',
      borderRadius: '5px',
      backgroundColor: '#fff',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      margin: '10px',
      width:" 90%"
    },
    matchNumber: {
      marginRight: '10px',
      fontWeight: 'bold'
    },
    team: {
      flex: 1,
      textAlign: 'center',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: '#555'
    },
    vs: {
      margin: '0 10px',
      color: '#888'
    },
    line: {
      position: 'absolute',
      top: '50%',
      left: 'calc(50% - 1px)',
      height: '100%',
      width: '2px',
      backgroundColor:'#888'
     }
  };

  return (
    <>
     <div className="center-container">
  {
          <Alert severity="warning" className="general-alert">
            This match is full. Please select another match!
          </Alert>
        }
  </div>
      <div style={styles.container}>
        <h2 style={styles.heading}>8-Team Knockout Fixture</h2>
        <div style={styles.knockoutFixture}>
          {fixtures.map((match, index) => (
            <div key={index} style={styles.fixtureMatch}>
              <div style={styles.matchNumber}>Match {index + 1}</div>
              <div style={styles.team}>{match.home}</div>
              <span style={styles.vs}>vs</span>
              <div style={styles.team}>{match.away}</div>
              {index < fixtures.length - 1}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};



// Helper function to generate knockout fixtures
const generateFixtures = (teams) => {
   const fixtures = [];
   const matches = teams.length -1;

for (let round =0; round<matches; round++) {
for (let i=0; i<teams.length/2; i++) {
const home = teams[i];
const away = teams[teams.length-1-i];
fixtures.push({home, away});
}
// Rotate teams for the next round
teams.splice(1,0,teams.pop());
}

return fixtures;
};

export default MatchFixture;


