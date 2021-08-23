import AppMenu from "./components/menu/app_menu";
import {createTheme, ThemeProvider} from "@material-ui/core"
import { deepPurple } from "@material-ui/core/colors";


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
