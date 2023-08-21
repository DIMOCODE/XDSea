import React, { Component ,useState,useEffect} from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import {sendSubscriberMail} from '../../axioscalls/user.js';
toast.configure();


export function MailTemplate() {
 
useEffect(()=>{
    bsCustomFileInput.init()

},[])

const [subject, setsubject] = useState("");
const [mailData, setMailData] = useState("");


const onChange = (e) => {
    setsubject(e.target.value)
    
}
const onEditorChange = (event, editor) => {
  const description_text = editor.getData();
  
    setMailData(description_text);
}

const handleFormSubmit = async () => {
 // e.preventDefault();
  const id = toast.error("Sending Mail.. Please wait")
  let reqData = {
    subject : subject,
    boc : mailData

  }
  let sentSubMail = await sendSubscriberMail(reqData);
  if (sentSubMail && sentSubMail.data && sentSubMail.data && sentSubMail.data.Success) {
    toast.success("Mail Successfully Sent");
      setTimeout(() => {
        window.location.reload();
      },2000);
  } else {
    toast.error("Mail Failed to Send");
  }
}


    return (
      <div>
       
        <div className="row">
         
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Create Mail</h4>
                <form className="forms-sample">
                <Form.Group>
                    <label htmlFor="exampleInputName1">subject</label>
                    <Form.Control type="text" className="form-control" id="subject" placeholder="Name" onChange={onChange} value={subject || ''} />
                  </Form.Group>
              
                  <Form.Group>
                  <CKEditor
                    editor={ ClassicEditor }
                   
                    onChange={ ( event, editor ) => {
                      onEditorChange( event, editor);

                    } }
                   
                />
                </Form.Group>
            
                  {/* <Form.Group>
                    <label>File upload</label>
                    <div className="custom-file">
                      <Form.Control type="file" className="form-control visibility-hidden" id="customFileLang" lang="es"/>
                      <label className="custom-file-label" htmlFor="customFileLang">Upload image</label>
                    </div>
                  </Form.Group> */}
                  
                 
                  {/* <button type="submit" className="btn btn-primary mr-2">Submit</button> */}
                </form>
              <button onClick={()=>handleFormSubmit()}>SEND</button>

              </div>
              <div>
             
              </div>
            </div>
          </div>
         
        </div>
      </div>
    )
  
}

export default MailTemplate;
