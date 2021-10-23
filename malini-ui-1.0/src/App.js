import AppMenu from "./components/menu/app_menu";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';


const theme = createTheme({
  palette:{
    primary: deepPurple,
    type: 'light'
  },
  typography: {
    allVariants:{color: '#7c4dff'},
    fontSize: 12
  }
});

function App() {
    
  return (
    <div>
      <ThemeProvider theme={theme}>
          <AppMenu />          
     </ThemeProvider>
    </div>
  );
}

export default App;
