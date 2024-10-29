import React from 'react';
import {Box, Container,Typography, IconButton, Divider} from '@mui/material'
import Header from './components/Header';
import {default as UUID} from "node-uuid";
import Split from 'react-split'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { TextField } from '@mui/material';

export const ACTIONS = {
    ACTION_ADD:'add',
    ACTION_DELETE:'delete',
    ACTION_EDIT:'edit'
}

export default function App(){
    let savedNotes = localStorage.getItem('saved_notes') || [];

    const [selectedNoteId,setSelectedNoteId] = React.useState(null);
    const [notes, dispatch] = React.useReducer(notesReducer, JSON.parse(savedNotes));
    const [isEditing,setIsEditing] = React.useState(false);
    const inputRef = React.useRef(null)

    const addNote = React.useCallback(() => dispatch({ action: ACTIONS.ACTION_ADD }), [dispatch]);
    const deleteNote = React.useCallback(id => dispatch({ action: ACTIONS.ACTION_DELETE, noteId: id }), [dispatch]);
    
    // Fetches data of selected note
    const selectedNote = React.useMemo(() => {
        return notes.find(note => note.id === selectedNoteId) || null;
    }, [notes, selectedNoteId]);

    
    // Updates notes in localStorage
    React.useEffect(() => {
        localStorage.setItem('saved_notes', JSON.stringify(notes));
    }, [notes]);

    // Pressing enter while editing title will make "Save" action
    function handleEnter(e,ref){
        e.key==="Enter" && ref.current.blur()
    }

    // If user tries to insert empty title, set it to "Untitled Note"
    function handleTitleBlur() {
        if (!selectedNote.title.trim()) {
            handleChange(selectedNote.id,'title',"Untitled Note");
        }
        setIsEditing(false);
    }

    function handleChange(noteId,field,value){
        let newProps = {[field]:value}
        dispatch({action:ACTIONS.ACTION_EDIT,noteId,newProps})
    }

    let notesElements = React.useMemo(()=>{ return notes.map(note => {
        return (
            <NoteElement note={note} key={note.id} 
            onDelete={(e)=>{e.stopPropagation();deleteNote(note.id)}} 
            onClick={() => {setSelectedNoteId(note.id)}} 
            selected={selectedNoteId === note.id ? true : false}
            />
        )
    })},[notes, selectedNoteId, deleteNote])

    return(
        <Container maxWidth={false} sx={{
            width:'1251px',
            height:'910px'
          }}>
            <Header onClick={addNote}>My Notes</Header>
            <Split
              sizes={[30, 70]}
              minSize={[100,820]}
              direction="horizontal"
              gutterSize={5}
              cursor="col-resize"
              style={{display:'flex', height:'910px', width:'1251px',borderRadius:15}}
              className='gutter'
            >
                {/* Left panel */}
                <Box sx={{backgroundColor:'#2C1A1A',height: '910px',overflowX: 'hidden'}}>
                    {notesElements}
                </Box>


                 {/* Right panel */}
                {selectedNote ? (
                    <Box sx={{backgroundColor:'#2C1A1A',height: '850px',padding:'30px',display:'flex',alignItems:'center',flexDirection:'column',overflowY:'auto',overflowX:'hidden'}}>

                        {isEditing ? (
                            <input maxLength={40} ref={inputRef} type='text' value={selectedNote.title} onKeyDown={(e) => handleEnter(e,inputRef)} onChange={(e)=>handleChange(selectedNote.id,'title',e.target.value)} onBlur={()=>handleTitleBlur()} autoFocus style={{
                                fontSize: "24px",
                                fontFamily: "RocknRoll One",
                                color: "white",
                                background: "transparent",
                                border: "none",
                                width:'100%',
                                outline: "none",
                                textAlign:'center'
                            }}></input>
        
                        ) : (
                            <Typography onClick={()=>setIsEditing(true)} fontSize={30} fontFamily={'RocknRoll One'} sx={{color:'white'}} width='100%' align='center'>
                                {selectedNote.title}
                            </Typography>
                        )}
                    
                        <Divider variant='middle' flexItem sx={{borderColor:'white',borderWidth:2,marginTop:'5px',marginBottom:'20px'}}/>

                        <TextField
                            multiline
                            fullWidth
                            value={selectedNote.body}
                            onChange={(e)=>handleChange(selectedNote.id,'body',e.target.value)}
                            sx={{lineHeight:'5px',border:'none',outline:'none',"& fieldset": { border: 'none' },"& .MuiInputBase-input": {color: "white",fontFamily:'RocknRoll One',fontSize:'25px',lineHeight: "2"}}}
                            />
                    </Box>
                ) : (
                    <Box sx={{backgroundColor:'#2C1A1A',height: '850px',padding:'30px',display:'flex',alignItems:'center',flexDirection:'column'}}>
                        <Typography fontSize={24} fontFamily={'RocknRoll One'} sx={{color:'white'}}>
                            Select note or create one!
                        </Typography>
                    </Box>
                )}

            </Split>
          </Container>
    )
}

function notesReducer(notes, props) {
    let newNotes = [];
    switch (props.action) {
        case ACTIONS.ACTION_ADD:
            newNotes = [...notes, { title: "New note " + (notes.length + 1), body: "", id: UUID.v4() }];
            break;
        case ACTIONS.ACTION_DELETE:
            newNotes = notes.filter(note => note.id !== props.noteId);
            break;
        case ACTIONS.ACTION_EDIT:
            newNotes = notes.map(note =>
                note.id === props.noteId ? { ...note, ...props.newProps } : note
            );
            break;
        default:
            console.warn("Unknown action:", props.action);
    }
    localStorage.setItem('saved_notes', JSON.stringify(newNotes));
    return newNotes;
}

function NoteElement({note, onDelete, onClick, selected}){
    return (
        <div 
            style={{
            backgroundColor: selected ? '#3F3F3F' : 'black',
            }}
            onClick={onClick}
            className='taskTile'
            >
    
            <Typography
            fontSize={24}
            fontFamily={'RocknRoll One'}
            sx={{
                maxWidth: '80%',
                whiteSpace: 'nowrap',
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
              }}
            >
                {note.title}
            </Typography>

            <IconButton onClick={(e)=>{onDelete(e)}}>
                <DeleteForeverIcon sx={{fontSize:'40px', color:'white'}} />
            </IconButton>
        </div>
    )
}