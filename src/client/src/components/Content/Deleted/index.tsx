import Header from "components/Content/Header";
import FileList from "components/Content/FileList";
import Commandbar from "components/Content/CommandBar";

function Deleted() {
    
    return (
        <>
            <Header onFilter={() => {}} />
            <Commandbar title="Deleted ones" selectedCount={0} totalCount={0} onDeleteRequest={() => {}} onSelectionToggleAll={() => {}} />
            {/* <FileList /> */}
            <div>Deleted</div>
        </>
    );
}

export default Deleted;