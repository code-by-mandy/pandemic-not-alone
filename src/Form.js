import {useState, useEffect } from 'react';
import firebase from './firebase';


function Form({closeForm, refreshPage}) {
    //states that store user input per form
    const [userTale, setUserTale] = useState("");
    const [emotionString, setEmotionString] = useState("");
    const [customEmotion, setCustomEmotion] = useState("");


    const showCustomBox = () => {
        const customBox = document.querySelector('.customBox');
        customBox.classList.add("show");
    }

    //turn HTML collection of selected options to string for firebase
    const emotionTags = (e) => {
        const emotionsCollection = e.target.selectedOptions;
                
        //turn collection to array first to get value of each option
        let emotionsArray = []
        Array.from(emotionsCollection).forEach ( emotion => {
                emotionsArray.push(emotion.value); 
        })

        //turn array into string and set emotionString state
        const emotionString = Array.from(emotionsArray).join(' and ');      
        setEmotionString(emotionString);    
    }


    //state that stores boolean value of whether form has been submitted or not - for closeForm prop method
    const [submitted, setSubmitted] = useState(false);

    // create individual story object with emotion and post keys, their values set by storyEmotion and userTale state values from event listeners
    const oneStory = {
        emotion: emotionString,
        custom: customEmotion,
        post: userTale,
        date: firebase.database.ServerValue.TIMESTAMP
    };
    
    //submitStory function - pushes oneStory object to firebase, clears form, sets 'submitted' state to true to trigger useEffect
    const submitStory = (e) => {
        e.preventDefault();
        const dbRef = firebase.database().ref();
        dbRef.push(oneStory);
        setUserTale("");
        setEmotionString("");
        setSubmitted(true);
    }

    //if form has been submitted, closeForm() -- unmount component
    useEffect( () => {
        if (submitted) {
            refreshPage();
            closeForm();
        }
      })


    return(
        <form action="submit" onSubmit={submitStory}>

            {/* {input for user story} set userTale state value with onChange}*/}
            <label htmlFor="story" name="story">Share your story:</label>
            <textarea 
                type="text" 
                id="story"
                name="story"
                placeholder="Your pandemic experience goes here"
                maxLength="200"
                onChange={ (e) => setUserTale(e.target.value)}
                required></textarea>

            {/* {input for select emotion, set storyEmotion state value with onChange} */}
            <label htmlFor="emotion" name="emotion">Which emotion(s) go with your story?</label>
            <select 
                id="emotion" 
                name="emotion" 
                onChange={emotionTags}
                required
                multiple
                size="6"
                >
                <option value="" disabled>Pick your emotion(s):</option>
                <option value="anxious">Anxiety</option>
                <option value="frustrated">Frustration</option>
                <option value="sad">Sadness</option>
                <option value="grateful">Gratitude</option>
                <option value="inspired">Inspiration</option>
                <option value="nuanced" className="custom" onClick={showCustomBox}>Other</option>
            </select>

            {/* {input for customized emotion should they click on "other, set customEmotion state value with onChange"} */}
            <div className="customBox">
                <label htmlFor="custom" name="custom">How do you feel?</label>
                <textarea type="text" id="custom" name="custom" maxLength="20" onChange={(e) => {setCustomEmotion(e.target.value)}}></textarea>
            </div>
            
            <button type="submit">Submit your story</button>
        </form>
    )
    }

export default Form;