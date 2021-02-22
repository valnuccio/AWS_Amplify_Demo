
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import React, { useEffect, useState } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';


// actual query you need to send
const listItems = `
  query MyQuery {
    listTodos {
      items {
        id
        name
        description
        filePath
      }
    }
  }
`


// used for rendering each item
const ListItem = ({id, name, description, imageUrl}) =>{





  return (
    <>
    <h3>{name}</h3>
    <p>{description}</p>
    {console.log('img', imageUrl)}
   <img src={imageUrl}/>
    </>
  )
  }





function App() {
  // this is setup for the 'fetch' essentially
     // this has to be an async request so it waits 
  const[list, setListItems] = useState(null)
  const[listUrls, setListUrls] = useState(null)



  const getImages = async items => {

   let urlArray=[]
    for(let index=0; index<items.length;index++){
      const toDoFilePath=items[index].filePath
      const toDoAccessUrl= await Storage.get(toDoFilePath)
      const imageObj={id:items[index].id, url: toDoAccessUrl}
      urlArray.push(imageObj)
    }

    setListUrls(newArr)
}

  const getList = async() => {
    
    // The API.graphql call here is what we imported above
    const { data } = await API.graphql(
      // this is also imported above and we are passing in our query requirements 
      graphqlOperation(listItems)
    );
    // this is basically saying after you get that back to do this with that data
    // IMPORTANT NOTE : you are setting the listItems of the useState here. in order to avoid null items I've incorporated the question marks. 
    // When you make that initial query you are going to get all the info back you would if you were in the aws console. Go back and take a look at that structure
    // to see why and how I only wanted the items themselves below.
      setListItems(data?.listTodos?.items)
      getImages(data?.listTodos?.items)


  }


  useEffect(()=>{
    // calls this once its done rendering the basic page
    getList()}
    
    ,
    [])


  

  const renderList = () =>{

    
    return list.map((item)=>{
    
    let obj=listUrls.filter((ele)=> ele.id===item.id)
    console.log('obj', obj, 'obj[0]url', obj[0].url)
    
    return (
    <ListItem id={item.id} name={item.name} description={item.description} imageUrl={obj[0].urlId} filePath={item.filePath}/>)
  })

  }

  

  return (
    <div className="App">
      <header className="App-header">
        {/* This renders the first time with nothing under it */}
       <h1>To Do List</h1>
       {/* only renders once the info has been set! */}
       {console.log('listUrls', listUrls)}
       {console.log('list', list)}
       {list && listUrls? <div>{renderList()}</div>:null}
        <div><AmplifySignOut/></div>
      </header>
    </div>
  );
}





export default withAuthenticator(App);

