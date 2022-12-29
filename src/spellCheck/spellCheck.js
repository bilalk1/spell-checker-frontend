import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from "axios";

import './spellCheck.css';


const SpellCheck = () => {
    let [replacements, setReplacements] = useState([{ word: '', replacement: [] }]);
    let [loading, setLoading] = useState(false);
    let [click, setIsClick] = useState(false);
    const formik = useFormik({
        validateOnChange: true,
        initialValues: {
            spellCheck: '',
        },
        onSubmit: values => {
            postSpellCheck(values.spellCheck)

        }

    });
    const postSpellCheck = (value) => {
        setLoading(true);
        axios.post(
            'http://localhost:5000/spell-check',
            { paragraph: value })
            .then(({ data }) => {
                let { issues } = data;
                for (let issue of issues) {
                    let { match: { surface, replacement, beginOffset, endOffset } } = issue;
                    setReplacements(oldArray => [...oldArray, { surface, replacement, beginOffset, endOffset }]);
                }
                setLoading(false);

            })
    }
    const replaceBetween = function (list, start, end, what) {
        console.log(list, start, end, what)
        return list.substring(0, start) + what + list.substring(end + 1)
    };

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div id="container">
                    <div class="row">
                        <label for="story" class='label'> <h2>Please write your paragraph:</h2></label>
                        <textarea
                            id="spellCheck"
                            name="spellCheck"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.spellCheck}
                            class="paragraph-input"
                        />
                        {/* <button className="" type="submit">Submit</button> */}
                        <button class="button-1" role="button" type="submit">Check Spelling Mistakes</button>
                    </div>

                    <div class="row">
                        <div><h2>Suggestions 🚀</h2></div>
                        {loading && <div><h4> Loading...</h4></div>}
                        {(click && replacements.length == 0 && !loading) && <div><h5> All Good ✅</h5></div>}
                        {replacements.length > 0 && replacements.map((r, i) => (
                            <div id="container-2" key={i}>
                                <div class="row-2 uderline" >{r.surface} </div>
                                <div class="row-2"> {r.replacement.map((replacement, i) => (
                                    <div id="container-3" key={i}>
                                        <button class="button-34" role="button" onClick={async () => {
                                            await formik.setFieldValue(
                                                'spellCheck', replaceBetween(formik.values.spellCheck, r.beginOffset, r.endOffset, replacement)
                                            );
                                            setIsClick(true)
                                            postSpellCheck(replaceBetween(formik.values.spellCheck, r.beginOffset, r.endOffset, replacement))
                                            setReplacements([]);

                                        }}>{replacement}</button>

                                    </div>))}</div>
                            </div>

                        ))}
                    </div>
                </div>
            </form>
        </div>


    );
};

export default SpellCheck;