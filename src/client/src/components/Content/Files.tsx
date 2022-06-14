import Commandbar from "./Commandbar";
import FileList from "./FileList";
import Header from "./Header";

function Files() {
    return (
        <>
            <Header />
            <Commandbar title="My Files" />
            <FileList files={[]} loaded={true} onSelectionToggleSingle={() => {}} />
        </>
    );
}

export default Files;