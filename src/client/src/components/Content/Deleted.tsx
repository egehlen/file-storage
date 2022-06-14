import Commandbar from "./Commandbar";
import Header from "./Header";
import FileList from "./FileList";

function Deleted() {
    
    return (
        <>
            <Header />
            <Commandbar title="Deleted ones" />
            {/* <FileList /> */}
            <div>Deleted</div>
        </>
    );
}

export default Deleted;