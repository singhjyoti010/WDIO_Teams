 import { ConditionType } from "./conditionType.ts";

export async function open(path: string = ""){
    await browser.url('https://teams.microsoft.com/' + path);
}

//exporting below to use in testspec
export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
  }

export async function visible(selector:  string, timeout: number=10000) {
    try{
        await $(selector).waitForExist({timeout: timeout, timeoutMsg: `Element ${selector} was not found within ${timeout}ms.`});

        await $(selector).waitForDisplayed({timeout: timeout,timeoutMsg: `Element ${selector} was not visible within ${timeout}ms.`});
    }
    catch(error){
        throw new Error(`Element ${selector} was not visible: ${getErrorMessage(error)}`);
    }
}

export async function visibleReturnable(selector:  string, timeout: number=10000) {
    try{
        await visible(selector,timeout);
        return true;
        //await expect(element).toBeDisplayed({wait: timeout,message: `Element ${selector} was not visible within ${timeout}ms.`});
    }
    catch(error){
        return false;
    }
}

export async function click(selector: string, timeout: number=10000) {
    try {
        // await $(selector).waitForDisplayed({timeout: timeout});
        // await $(selector).waitForClickable({timeout: timeout});
        // const el=await $(selector);
        const el=await waitForElementToLoad(selector,ConditionType.both,timeout);
        await el.click();
    }
    catch(error) {
        throw new Error(`Element ${selector} was not clicked: ${getErrorMessage(error)}`);
    }
}

export async function exists(selector: string, timeout: number = 4000){
    try {
        await waitForElementToLoad(selector,ConditionType.exists,timeout);
        return true;
    }
    catch(error) {
        return false;
    }
}

export async function move(selector: string, timeout: number=10000) {
    try {
        const element=await waitForElementToLoad(selector,ConditionType.visible,timeout);
        await element.moveTo();
    }
    catch(error) {
        throw new Error(`Element ${selector} could not be moved to as: ${getErrorMessage(error)}`);
    }
}

export async function scrollTillElement(selector: string, timeout: number=10000) {
    try {
        const element=await waitForElementToLoad(selector,ConditionType.visible,timeout);
        await browser.executeScript(`arguments[0].scrollIntoView()`,[element]);
        // await element.scrollIntoView();
    }
    catch(error) {
        throw new Error(`Element ${selector} was not found as: ${getErrorMessage(error)}`);
    }
}

export async function rightClick(selector: string) {
    try {
        const element=await $(selector);
        await element.moveTo();

        const action=browser.action("pointer",{
            "parameters": {pointerType: 'mouse'}
        });
        await action.down("right").pause(1000).up("right").perform();
    }
    catch(error) {
        throw new Error(`Element ${selector} was not clicked: ${getErrorMessage(error)}`);
    }
}

export async function waitTillDisplayed(selector: string, timeout: number = 10000){
    try {
        const element=await $(selector);
        await element.waitForDisplayed({timeout: timeout});
    } catch (error) {
        throw new Error(`Element ${selector} not displayed: ${getErrorMessage(error)}`);
    }
}

export async function waitTillAttributeDisappears(selector: string, attributeName: string, timeout: number = 10000){
    try {
        const element=await $(selector);
        await browser.waitUntil( ()=> {
            return element.getAttribute(attributeName) === null;
        }, {
            timeout: timeout, 
            timeoutMsg: `The attribute ${attributeName} did not disappear within the timeout.`,
            interval: 1000
        });
    } catch (error) {
        throw new Error(`Element ${selector} failed to wait for attribute ${attributeName} to disappear with error: ${getErrorMessage(error)}`);
    }
}

export async function typeKeys(selector:string,text: string, timeout: number=10000) {
    try {
        const element= await $(selector);
        await element.waitForDisplayed({timeout: timeout});
        let stringArr: string[] = text.split('');
        for (let i =0; i<stringArr.length; i++){
            await browser.pause(100);
            await  browser.keys(stringArr[i]);
        }
    } catch (error) {
        throw new Error(`Unable to send text to Element ${selector}: ${getErrorMessage(error)}`);
    }
}

export async function typeText(selector:string,text: string, timeout: number=10000) {
    
    try {
        const element=await $(selector);
        await visible(selector, timeout=timeout);
        await $(selector).waitForDisplayed({timeout: timeout});
        await element.setValue(text);
    } catch (error) {
        throw new Error(`Unable to send text to Element ${selector}: ${getErrorMessage(error)}`);
    }
}

export async function switchToFrame(selector: string){
    try {
        const frameElement=await $(selector);
        await browser.switchToFrame(frameElement);
    }
    catch (error){
        throw new Error(`Unable to switch to iFrame ${selector}: ${getErrorMessage(error)}`);
    }
}

export async function switchToWindow( windowUrlText: string, windowTitle?: string, timeout: number = 5000, tryCount: number = 3) { // Maximum number of attempts to switch windows
    await browser.pause(timeout);
    let mainHandle;
    let mainUrl ;
    let mainTitle;
    let handles;
    let isfallBackWindowAvailable = false;
    try{
        mainHandle= await browser.getWindowHandle();
        mainUrl=await browser.getUrl();
        mainTitle=await browser.getTitle();
        handles = (await browser.getWindowHandles()).filter(handle => handle !== mainHandle);
        isfallBackWindowAvailable=true;
        if (mainUrl.includes(windowUrlText) && (!windowTitle || mainTitle.includes(windowTitle))) {
            console.log(`Found the desired window URL: ${mainUrl}\n***************************[${mainTitle}]*****************************`);
            return; // Already in the desired window, exit the function
        }
    }
    catch{
        handles=await browser.getWindowHandles();
    }

    let shouldCheckTitle = windowTitle !== undefined;

    try {
        for (const [index, handle] of handles.entries()) {
            await browser.switchToWindow(handle);
            const currentUrl = await browser.getUrl();
            const currentTitle = await browser.getTitle();
            let isURLMatched;

            isURLMatched = currentUrl.includes(windowUrlText);

            if (!isURLMatched || (shouldCheckTitle && !currentTitle.includes(windowTitle))) {
                await browser.switchToWindow(handle);
                const isLast = index === handles.length - 1;
                if (tryCount > 0 && isLast) {
                    await switchToWindow(windowUrlText, windowTitle, timeout, tryCount - 1);
                    await browser.pause(5000);
                }
            } else {
                console.log(`Found the desired window URL: ${currentUrl}\n***************************[${currentTitle}]*****************************`);
                return; // Found the desired window, exit the function
            }
        }
        if(isfallBackWindowAvailable){
            let isCorrectURL = mainUrl.includes(windowUrlText);

            if (!isCorrectURL) {
                await browser.switchToWindow(mainHandle); // Switch back to the main window
                throw new Error('Window not found: ' + windowUrlText);
            }
        }
    } catch (error) {
      console.error(error);
    }
  }

export async function waitForElementToLoad(selector: string,conditionType: ConditionType, timeout: number){
    switch (conditionType) {
        case ConditionType.visible:
            await $(selector).waitForDisplayed({timeout: timeout, timeoutMsg: `Element with selector ${selector} was not visible after ${timeout} milliseconds.`});
            break;
        case ConditionType.clickable:
            await $(selector).waitForClickable({timeout: timeout, timeoutMsg: `Element with selector ${selector} was not clickable after ${timeout} milliseconds.`});
            break;
        case ConditionType.exists:
            await $(selector).waitForExist({timeout: timeout, timeoutMsg: `Element with selector ${selector} was not found in DOM after ${timeout} milliseconds.`});
            break;
        case ConditionType.both:
            await $(selector).waitForDisplayed({timeout: timeout, timeoutMsg: `Element with selector ${selector} was not visible after ${timeout} milliseconds.`});;
            await $(selector).waitForClickable({timeout: timeout, timeoutMsg: `Element with selector ${selector} was not found in DOM after ${timeout} milliseconds.`});
            break;
    }

    const el=await $(selector);
    return el;
}

export function isDesktop(){
    if(process.env.PLATFORMNAME.toUpperCase() === 'DESKTOP')
    //if(browser.capabilities['platformName'] === 'win32' || browser.capabilities['browserName']==='electron')
        return true;
    else
        return false;
}

export function isWeb(){
    if(process.env.PLATFORMNAME.toUpperCase() === 'WEB')
    // if(browser.capabilities['platformName'] === 'windows')
       return true;
    else
        return false;
}


export function isAndroid(){
    // if(browser.capabilities['platformName'] === 'android')
    //     return true;
    // else
    //     return false;
}

export function isIOS(){
    // if(browser.capabilities['platformName'] === 'ios')
    //     return true;
    // else
    //     return false;
}