import React from "react";
import TeamContext from "./TeamContext";
import { useState } from "react";
const MatchState=(props)=>{
  
    return(
        <TeamContext.provider >
            {props.children}
        </TeamContext.provider>
    )
}
export default MatchState 