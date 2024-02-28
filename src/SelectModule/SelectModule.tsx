// @ts-ignore
import React, { useState, useRef, useEffect } from 'react';
import ActionButton from '../Elements/ActionButton';
import { moduleProps } from '../typings';
import './SelectModule.css';
// @ts-ignore
import Arrow from '../assets/downarrow.svg';
// @ts-ignore
import search from '../assets/search.svg';
// @ts-ignore
import Close from '../assets/close.svg';
const { data } = require('../Utils/db_country_state.js');

const NestedSelect = ({
                          buttonContent,
                          selectedValue,
                          showCustomList,
                          selectLimit,
                          trailing,
                          trailingIcon,
                          leading,
                          state,
                          width,
                          enableButton,
                          height,
                          placeholderCtx,
                          chip,
                          chipCount,
                          expandChip,
                          omitSelected,
                          inputClass,
                          dropDownClass,
                          buttonClass,
                          error,
                          helperText,
                          disable,
                          selectAllOption,
                          callback,
                          onChange,
                          onSearch,
                          onViewmore,
                          onChipDelete,
                          ...props
                      }: moduleProps) => {

    const [expandCountry, setExpandCountry] = useState<null | number>(null);
    const [openDropDown, setopenDropDown] = useState<boolean>(false);
    const [showTrailing, setShowTrailing] = useState<boolean>(true);
    const [showButtonComponent, setShowButtonComponent] = useState<boolean>(true);
    const [showState, setShowState] = useState<boolean>(true);
    const [showContinent, setShowContinent] = useState<boolean>(true);
    const [searchValue, setsearchValue] = useState<string>("");
    const [checkedValues, setcheckedValues] = useState<any>([]);
    const [savedVales, setSavedValues] = useState<any>([]);
    const [selectItemLimit, setSelectItemLimit] = useState<number>(-1);
    const [disableSelectBox, setDisableSelectBox] = useState<boolean>(false);
    const [isLoading, setIsloading] = useState(false);
    const [isLeading, setLeading] = useState<boolean>(true);
    const [isTrailing, setIsTrailing] = useState<boolean>(true);
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const [placeholder, setPlaceholder] = useState<boolean>(true);
    const [isChip, setIschip] = useState<boolean>(false);
    const [chipNoCount, setChipNoCount] = useState<number>(5);
    const [chipExpandView, setChipExpandview] = useState<boolean>(false);
    const [omitSelectedCloseDropDown, setOmitSelected] = useState<boolean>(false);
    const [toggleView, setToggleView] = useState<boolean>(false);
    const [allOptionSelectable, setSelectAllOptions] = useState<boolean>(false);
    const [selectAllRegions, setselectAllRegions] = useState<boolean>(false);

    var dataFor: any | undefined;
    const ref = useRef<null | any>(null);

    useEffect(() => {
        selectedValue.map((item:any )=> {
            delete item.disabled;
            if(item?.subData?.length > 0){
                item.subData.map((zone: any) => delete zone.disabled)
            }
        });
        setSelectItemLimit(selectLimit ?? -1);
        setcheckedValues(selectedValue ?? []);
    }, []);

    useEffect(() => {
        if (trailing !== undefined) {
            setShowTrailing(trailing);
        }
        if (enableButton !== undefined) {
            setShowButtonComponent(enableButton);
        }
        if (state !== undefined) {
            setShowState(state);
        }
        if (leading !== undefined) {
            setLeading(leading);
        }
        if (trailingIcon !== undefined) {
            setIsTrailing(trailingIcon)
        }
        if (placeholderCtx !== undefined) {
            setPlaceholder(placeholderCtx);
        }
        if (chip !== undefined) {
            setIschip(chip)
        }
        if (chipCount !== undefined) {
            setChipNoCount(chipCount);
        }
        if (omitSelected !== undefined) {
            setOmitSelected(omitSelected);
        }
        if (expandChip !== undefined) {
            setChipExpandview(expandChip)
        }
        if (selectAllOption !== undefined){
            setSelectAllOptions(selectAllOption)
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setopenDropDown(false);
                setIsloading(true);
                setIsExpand(false);
                if (omitSelectedCloseDropDown) {
                    if (selectedValue?.length > 0) {
                        setcheckedValues(selectedValue);
                    } else {
                        setcheckedValues([]);
                    }
                }
                if (chipExpandView) {
                    if (chipCount) {
                        setChipNoCount(chipCount);
                    }
                }
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [openDropDown]);

    useEffect(() => {
        if (selectItemLimit && selectItemLimit > 0) {
            if (selectItemLimit <= checkedValues.length) {
                setDisableSelectBox(true);
            }
        }
    }, [checkedValues]);

    const openShow = (e: any, i: number) => {
        if (i === expandCountry)
            setExpandCountry(-1);
        else
            setExpandCountry(i);
    };

    const searchCountiresorState = (e: any) => {
        setsearchValue(e.target.value);
        setIsloading(false);
        let val = e.target.value?.toLowerCase();
        function scrollIfNeeded(element: any, container: any, val: any) {
            if (val?.length == 0 || val == "" || val == undefined || val == null) {
                container.scrollTop = 0;
            }else {
                if (element.offsetTop < container.scrollTop) {
                    container.scrollTop = element.offsetTop;
                }
                else {
                    const offsetBottom = element?.offsetTop;
                    const scrollBottom = container?.offsetHeight;
                    if (offsetBottom > scrollBottom) {
                        if (val?.length == 0) {
                            container.scrollTop = 0;
                        } else {
                            container.scrollTop = offsetBottom - 10;
                        }
                    }
                }
            }
        }
        document.querySelectorAll(".NSI-select-menuitem-list")
            .forEach((ef: any) => {
                if (ef.id?.includes(val)) {
                    var elementToScroll = document.getElementById(ef.id);
                    var elementInScroll = document.getElementById('NSI-select-drop-down-menu-itembox');
                    scrollIfNeeded(elementToScroll, elementInScroll, val);
                }
            });
        if (onSearch) {
            onSearch(e.target.value);
        }
    }
    const excludeDisabled = (value: any) => {
        if(showCustomList?.length > 0){
            let dataFinals = JSON.parse(JSON.stringify(value))
            const dataFinal = dataFinals.filter((d: any) => d?.disabled !== true);
            dataFinal.forEach((d: any) =>  {
                if( d.subData?.length > 0){
                    d.subData = d?.subData.filter((it: any) => it?.disabled !== true);
                }
            });
            setcheckedValues([...dataFinal]);
            setSavedValues([...dataFinal]);
            dataFor = dataFinal;
        }else{
            setcheckedValues([...value]);
            setSavedValues([...value]);
            dataFor = value;
        }
        onChangeComp();
    }
    const selecttheCountry = (e: any, c_data?: any) => {
        setselectAllRegions(false)
        var array: any | undefined = [];
        if (findInselected(c_data, false)[0]) {
            array = checkedValues.filter((item: any) => item.value !== c_data.value)
        } else {
            if (e.target.checked || !e.target.dataset.checked) {
                if (checkedValues.length !== 0) {
                    checkedValues?.forEach((element: any) => {
                        if (element.value === c_data.value) {
                            element.subData = [...c_data.subData]
                            array = [...checkedValues]
                        } else {
                            const option = {
                                name: c_data.name,
                                value: c_data.value,
                                subData: c_data.subData,
                                count: c_data.subData?.length,
                                ...c_data
                            }
                            array = [...checkedValues, option]
                        }
                    });
                } else {
                    const option = {
                        name: c_data.name,
                        value: c_data.value,
                        subData: c_data.subData,
                        count: c_data.subData?.length,
                        ...c_data
                    }
                    array = [...checkedValues, option]
                }
            } else {
                array = checkedValues.filter((item: any) => item.value !== c_data.value)
            }
        }
        excludeDisabled(array);
    }

    const selecttheState = (e: any, c_data: any, s_state: any, n: number, m: number) => {
        setselectAllRegions(!selectAllRegions)
        var array: any | undefined = [];
        if (findInselectedarray(c_data.value, s_state.value, false)[0]) {
            var count = 0;
            checkedValues?.forEach((element: any, sd: number) => {
                if (element.value === c_data.value) {
                    var finalResult;
                    var counrtyFilter;
                    var state_present = element.subData.some((item: any) => item.value === s_state.value);
                    if (state_present) {
                        finalResult = element.subData.filter((ele: any) => ele.value !== s_state.value);
                        element.subData = finalResult;
                        if (!(finalResult?.length > 0))
                            counrtyFilter = checkedValues.filter((d: any) => element?.value !== d.value);
                    } else {
                        element.subData = [...element.subData, s_state]
                    }
                    array = counrtyFilter?.length > 0 ? [...counrtyFilter] : [...checkedValues];
                    // array = [...checkedValues];
                }
                else {
                    if (count === 0) {
                        const option = {
                            ...c_data,
                            name: c_data.name,
                            value: c_data.value,
                            count: c_data.subData?.length,
                            subData: [s_state]
                        }
                        array = [...checkedValues, option];
                        count = count + 1;
                    }
                }
            })
        } else {
            if (checkedValues.length === 0) {
                const option = {
                    ...c_data,
                    name: c_data.name,
                    value: c_data.value,
                    count: c_data.subData?.length,
                    subData: [s_state],
                }
                array = [...checkedValues, option]
            } else {
                var count = 0;
                checkedValues?.forEach((element: any, sd: number) => {
                    if (element.value === c_data.value) {
                        var finalResult;
                        var counrtyFilter;
                        var state_present = element.subData.some((item: any) => item.value === s_state.value);
                        if (state_present) {
                            finalResult = element.subData.filter((ele: any) => ele.value !== s_state.value);
                            element.subData = finalResult;
                            if (!(finalResult?.length > 0))
                                counrtyFilter = checkedValues.filter((d: any) => element?.value !== d.value);

                        } else {
                            element.subData = [...element.subData, s_state]
                        }
                        array = counrtyFilter?.length > 0 ? [...counrtyFilter] : [...checkedValues];
                        // array = [...checkedValues];
                    }
                    else {
                        if (count === 0) {
                            const option = {
                                ...c_data,
                                name: c_data.name,
                                value: c_data.value,
                                count: c_data.subData?.length,
                                subData: [s_state]
                            }
                            array = [...checkedValues, option];
                            count = count + 1;
                        }
                    }
                })
            }
        }
        excludeDisabled(array);
    }

    const selectAllCountryState = (e: any, value: boolean, isCont: boolean ) => {
        if(value == false){
            setcheckedValues([]);
            setSavedValues([]);
            dataFor = [];
            onChangeComp();
        }else{
            //excludeDisabled(data(showCustomList, showContinent))
        }
    }

    const findInselectedarray = (country_code: string, state_code: string, isDisabled:boolean ) => {
        let result = [false];
        checkedValues.some((element: any) => {
            if (element.value === country_code) {
                element.subData.some((e: any) => {
                    if(isDisabled && isDisabled == true && state_code == e.value){
                        e.disabled = isDisabled
                    }
                    // if(e?.disabled == true) result[1] = true;//@@
                    return result[0] = e.value == state_code ? true : false
                });
            }
        });
        return result;
    };

    const findInselected = (country_data: any, isDisabled: boolean) => {
        var result = [false];
        checkedValues.forEach((element: any) => {
            if (element.value === country_data.value) {
                if(isDisabled && isDisabled== true){
                    element.disabled = isDisabled
                }
                if(element?.subData?.length === country_data?.subData?.length){
                    result[0] = element?.subData?.length === country_data?.subData?.length;
                    // if(element?.disabled){ //@@
                    //     result.push(true);
                    // }else{//@@
                    //     result.push(false);
                    // }
                }
            }else{
                result.push(false);
            }
        })
        return result
    }

    const selectedCount = (code: string) => {
        var result = 0;
        checkedValues.forEach((ele: any) => {
            if (ele.value === code) {
                result = ele.subData?.length
            }
        });
        return result
    }

    const onChangeComp = () => {
        if (onChange) {
            onChange(dataFor);
        }
    };

    const getValue = (ctx: any) => {
        var strings: string = "";
        if (ctx) {
            checkedValues?.map((d: any) => {
                var s: string = d.subData.length > 0 ? `(${d.count} of ${d.subData.length}),` : ","
                strings = `${strings} ${d?.name}${s}`
            });
        }
        return strings;
    }

    const chipDelete = (obj: any) => {
        if (onChipDelete) {
            onChipDelete(obj);
        }
        var array = checkedValues.filter((item: any) => item.value !== obj.value);
        setcheckedValues(array);
        dataFor = array;
    }
    return (
        <div className='NSI-main-wrapper' ref={ref} style={{ width: width }}>
            <div className={`${inputClass} NSI-input-box-wrap`} style={{ borderColor: error ? "red" : "" }}>
                {isChip && <div>
                    {checkedValues?.length > 0 &&
                        <div className="NSI-main-overlap-nested">
                            {checkedValues?.map((item: any, i: number) => i < chipNoCount && <span className="NSI-main-chipicons-label">
                                {item.name}
                                    {item.subData.length > 0 &&
                                        <>
                                            ({item.subData.length} of {item.subData.length ?? "1"})
                                        </>
                                    } {" "}
                                    <img src={Close} style={{ width: 8, marginLeft: 4, cursor: "pointer" }} onClick={() => chipDelete(item)} />
                            </span>
                            )}
                            {(checkedValues?.length > chipNoCount) && <span className="NSI-main-more-trailing" onClick={() => {
                                if (onViewmore) {
                                    setToggleView(true);
                                    onViewmore(checkedValues);
                                }
                                if (chipExpandView) {
                                    setChipNoCount(checkedValues?.length)
                                }
                            }}> + {checkedValues?.length - chipNoCount} more</span>}
                            {(checkedValues?.length == chipNoCount) && chipExpandView && toggleView && <span className="NSI-main-more-trailing" onClick={() => {
                                if (chipExpandView) {
                                    setChipNoCount(chipCount ? chipCount : 5)
                                }
                            }}>Less</span>}
                        </div>
                    }
                </div>
                }

            </div>
            {helperText && <p className={error ? 'NSI-main-input-helper-text NSI-error-text' : 'NSI-main-input-helper-text'}>{helperText}</p>}
            <div style={{ paddingTop: 5 }} onChange={() => onChangeComp()}>
                {openDropDown &&
                    <div className={`${dropDownClass} NSI-select-drop-down-menu-wrapper`} >
                        {showContinent == true ? <>
                                <div className='NSI-select-drop-down-menu-itembox' id="NSI-select-drop-down-menu-itembox" style={{ height: height }}>
                                    {/* {allOptionSelectable == true && <div>
                                        <li className='NSI-select-menuitem-list' onClick={(e: any) => {
                                                setselectAllRegions(!selectAllRegions);
                                                selectAllCountryState(e, !selectAllRegions, showContinent);
                                            }}>
                                            <div className='NSI-select-menuitem-leading'>
                                                <input
                                                    type="checkbox"
                                                    className='NSI-select-menuitem-checkbox'
                                                    checked={selectAllRegions}
                                                    // disabled={c_data?.disabled}
                                                    onChange={(e : any) => {
                                                        setselectAllRegions(!selectAllRegions);
                                                        selectAllCountryState(e, !selectAllRegions, showContinent);
                                                    }}
                                                />
                                                <div>All Regions</div>
                                            </div>
                                        </li>
                                    </div>} */}
                                    {data.map((conti_data: any, index: number) =>
                                        <div key={index}>
                                            {showContinent && <div className='NSI-continent-listitem' id={conti_data.name?.toLowerCase()} key={index}>
                                                <li className='NSI-continent-text'>
                                                    {conti_data?.name}
                                                </li>
                                            </div>
                                            }
                                            {conti_data?.subData.map((c_data: any, i: number) =>
                                                <div key={i} className={expandCountry === i ? "NSI-select-drop-down-menu-expanded" : ""} data-id={i} style={c_data?.disabled ? { background: "#cccccc79" } : {}}>
                                                    <li className='NSI-select-menuitem-list' id={c_data.name?.toLowerCase()} onClick={(e: any) => {
                                                        if(!(c_data?.disabled && c_data?.disabled == true)) selecttheCountry(e, c_data)
                                                    }}>
                                                        <div className='NSI-select-menuitem-leading'>
                                                            <input
                                                                type="checkbox"
                                                                className='NSI-select-menuitem-checkbox'
                                                                checked={findInselected(c_data, c_data?.disabled)[0]}
                                                                disabled={disableSelectBox || c_data?.disabled}
                                                                onChange={() => { }}
                                                                // onChange={(e: any) => selecttheCountry(e, c_data)}
                                                            />
                                                            <div>{c_data.name}</div>
                                                        </div>
                                                        {(c_data?.subData?.length > 0 && showState) && <div className='NSI-select-menuitem-trailing'>
                                                            {showTrailing && <span className='NSI-select-menuitem-trailing-text'>{selectedCount(c_data.value)} of {c_data?.subData?.length}</span>}
                                                            <img src={Arrow} className={expandCountry === i ? "NSI-select-arrow-collapse-svg" : "NSI-select-arrow-expand-svg"} onClick={(e: any) => {
                                                                openShow(e, i);
                                                                e.stopPropagation();
                                                                e.nativeEvent.stopImmediatePropagation();
                                                            }} />
                                                        </div>
                                                        }
                                                    </li>

                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {showButtonComponent &&
                                    <>
                                        <hr className='NSI-select-drop-down-menu-seperation' />
                                        <ActionButton
                                            value={savedVales}
                                            setIsLoading={setIsloading}
                                            setIsExpand={setIsExpand}
                                            isExpand={isExpand}
                                            disable={disable}
                                            chipExpandView={chipExpandView}
                                            chipCount={chipCount}
                                            setChipNoCount={setChipNoCount}
                                            callback={callback ? callback : () => { }}
                                            buttonContent={buttonContent}
                                            buttonClass={buttonClass}
                                            closeDropDown={(val: any) => {
                                                setopenDropDown(val);
                                                setsearchValue("");
                                            }}
                                        />
                                    </>
                                }
                            </> :
                            <>
                                <div className='NSI-select-drop-down-menu-itembox' id="NSI-select-drop-down-menu-itembox" style={{ height: height }}>
                                    {allOptionSelectable == true && <div>
                                        <li className='NSI-select-menuitem-list' onClick={(e: any) => {
                                            setselectAllRegions(!selectAllRegions);
                                            selectAllCountryState(e, !selectAllRegions, showContinent)
                                        }}>
                                            <div className='NSI-select-menuitem-leading'>
                                                <input
                                                    type="checkbox"
                                                    className='NSI-select-menuitem-checkbox'
                                                    checked={selectAllRegions}
                                                    // disabled={c_data?.disabled}
                                                    onChange={(e : any) => {
                                                        setselectAllRegions(!selectAllRegions);
                                                        selectAllCountryState(e, !selectAllRegions, showContinent)
                                                    }}
                                                />
                                                <div>All Regions</div>
                                            </div>
                                        </li>
                                    </div>}
                                    {data(showCustomList, showContinent).map((c_data: any, index: number) =>
                                        <div key={index} className={expandCountry === index ? "NSI-select-drop-down-menu-expanded" : ""} data-id={index} style={c_data?.disabled ? { background: "#cccccc79" } : {}}>
                                            <li className='NSI-select-menuitem-list' id={c_data.name?.toLowerCase()} onClick={(e: any) => {
                                                if(!(c_data?.disabled && c_data?.disabled == true)) {
                                                    selecttheCountry(e, c_data);
                                                }
                                            }}>
                                                <div className='NSI-select-menuitem-leading'>
                                                    <input
                                                        type="checkbox"
                                                        className='NSI-select-menuitem-checkbox'
                                                        checked={findInselected(c_data, c_data?.disabled)[0]}
                                                        disabled={disableSelectBox || c_data?.disabled}
                                                        onChange={() => { }}
                                                        // onChange={(e: any) => selecttheCountry(e, c_data)}
                                                    />
                                                    <div>{c_data.name}</div>
                                                </div>
                                                {(c_data?.subData?.length > 0 && showState) && <div className='NSI-select-menuitem-trailing'>
                                                    {showTrailing && <span className='NSI-select-menuitem-trailing-text'>{selectedCount(c_data.value)} of {c_data?.subData?.length}</span>}
                                                    <img src={Arrow} className={expandCountry === index ? "NSI-select-arrow-collapse-svg" : "NSI-select-arrow-expand-svg"} onClick={(e: any) => {
                                                        openShow(e, index);
                                                        e.stopPropagation();
                                                        e.nativeEvent.stopImmediatePropagation();
                                                    }} />
                                                </div>
                                                }
                                            </li>
                                            {showState && expandCountry === index && c_data.subData.length > 0 &&
                                                c_data.subData.map((item: any, k: number) =>
                                                    <li className='NSI-select-menuitem-list inner-list' key={k} onClick={(e: any) => {
                                                        if(!(item?.disabled && item?.disabled == true)) selecttheState(e, c_data, item, k, index)
                                                    }} id={item.name?.toLowerCase()} data-id={index} style={item?.disabled ? { background: "#cccccc79" } : {}}>
                                                        <div className='NSI-select-menuitem-leading'>
                                                            <input
                                                                type="checkbox"
                                                                onChange={() => { }}
                                                                // onChange={(e: any) => selecttheState(e, c_data, item, k, index)}
                                                                checked={findInselectedarray(c_data.value, item.value, item?.disabled)[0]}
                                                                className='NSI-select-menuitem-checkbox'
                                                                disabled={item?.disabled}
                                                            /><div>{item.name}</div>
                                                        </div>
                                                        <div>
                                                        </div>
                                                    </li>
                                                )}
                                        </div>
                                    )}
                                </div>
                                {showButtonComponent && <>
                                    <hr className='NSI-select-drop-down-menu-seperation' />
                                    <ActionButton
                                        value={savedVales}
                                        disable={disable}
                                        setIsLoading={setIsloading}
                                        setIsExpand={setIsExpand}
                                        isExpand={isExpand}
                                        chipExpandView={chipExpandView}
                                        chipCount={chipCount}
                                        setChipNoCount={setChipNoCount}
                                        callback={callback ? callback : () => { }}
                                        buttonContent={buttonContent}
                                        buttonClass={buttonClass}
                                        closeDropDown={(val: any) => {
                                            setopenDropDown(val);
                                            setsearchValue("");
                                        }}
                                    />
                                </>
                                }
                            </>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default NestedSelect