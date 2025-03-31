import { click, switchToFrame, typeKeys, visible, visibleReturnable, isWeb, isDesktop, switchToWindow, waitTillDisplayed } from '../../eventHelper.ts';
import { addTabHooks } from '../../hooks/commonHooks.ts';
import { appBarHooks, appStoreHooks, createWorkFlow, iFrameHooks, oneNoteTab } from '../../hooks/commonHooks.ts';
import { Key } from 'webdriverio'
import { getAttribute, selectByAttribute } from 'webdriverio/build/commands/element';
import { specConstant, windowURLs } from '../../constants.ts';
import { ConditionType } from '../../conditionType.ts';
import { slidoHooks } from '../../hooks/slidoHooks.ts';
import { CommonHelper } from '../common/common-helper.ts';


export class SlidoHelper extends CommonHelper{
    addSlidoAsTabFromChannel(Slido: string, teamName: string) {
        throw new Error('Method not implemented.');
    }
    async goToChat(chatName: string) {
        if (await isDesktop()){
            await browser.switchWindow("https://teams.microsoft.com/v2");
        }
        const el = await $(slidoHooks.chatBtn).getAttribute('aria-pressed');
        if (el == 'false') {
            await click(slidoHooks.chatBtn,5000);
        }
        await click(slidoHooks.goToChat(chatName),30000);
        await visible(slidoHooks.chatHeader, 20000);
    }

    async goToChannel(teamName: string, channelName: string) {
        if (await isDesktop()){
            await browser.switchWindow("https://teams.microsoft.com/v2");
        }
        const el = await $(appBarHooks.teamsBtn).getAttribute('aria-pressed');
        if (el == 'false') {
            await click(appBarHooks.teamsBtn, 3000);
        }
        await click(slidoHooks.channelClick(teamName, channelName), 20000);
        await visible(slidoHooks.addTabBtn, 30000);
    }

    async addSlidoAppAsTab(Slido: string,channelName:string){
        await click(slidoHooks.discoverAppsBtn,20000);    
        await click(slidoHooks.clickSearchBox,20000);
        await typeKeys(slidoHooks.clickSearchBox, Slido ,20000);
        await click(slidoHooks.selectSlido,20000);
        await browser.pause(10000);
        await click(slidoHooks.addAppToTeams,20000);
        await click(slidoHooks.inputChannelName,20000);
        await typeKeys(slidoHooks.inputChannelName,channelName,20000);
        await click(slidoHooks.selectChatOrChannel(channelName),20000);
        await click(slidoHooks.GoInChat,20000);
        await click(slidoHooks.saveBtnSlido,20000);
       
    }//passed- 3992196

    async addSlidoAsTabFromOpenAppInChat(Slido: string ){
         await click(slidoHooks.openApp, 20000);
        // await visible(addTabHooks.addNewApp,20000);
         await click(slidoHooks.searchBtnOpenApp,20000);   
         await typeKeys(slidoHooks.searchBtnOpenApp,Slido, 20000);
         await visibleReturnable(slidoHooks.addSlidoApp,50000);
         await click(slidoHooks.addSlidoApp,20000);
         await browser.pause(2000);   
         await click(slidoHooks.pinSlido,20000);
         await click(slidoHooks.clickSaveBtn,20000);
         await browser.pause(5000);
    }//passed

    async goToSlidoWindow(){
        const windowHandles = await browser.getWindowHandles();
        const popOutWindowHandle = windowHandles[1];
        browser.switchToWindow(popOutWindowHandle);
    }

    async switchToTeamsMainWindow(timeout: number = 5000) {
        //switch to a window randomly
        await browser.switchWindow(windowURLs.window);
    }

    async createSlidoInChannel( Slido: string,slidoPopOutLogin:string){
    await click(slidoHooks.openApp, 20000);
     await click(slidoHooks.searchBtnOpenApp,20000);   
     await typeKeys(slidoHooks.searchBtnOpenApp,Slido, 20000);
     await visibleReturnable(slidoHooks.addSlidoApp,50000);
     await click(slidoHooks.addSlidoApp,20000);
     await $(slidoHooks.pinSlido).waitForClickable({timeout:20000});    
     await click(slidoHooks.pinSlido,20000);
     await click(slidoHooks.clickSaveBtn,20000);
     await browser.pause(5000);
     //await this.goToTab(Slido);
   // await click(slidoHooks.clickSlido,20000);
     await browser.pause(3000);
     if(await isWeb()){
        await this.switchToIFrame();
    }
     await click(slidoHooks.slidoLoginBtn),
     await this.goToSlidoWindow();
     await click(slidoHooks.rejectCookies,15000);
     await click(slidoHooks.enterSlidoEmail,15000);
     await typeKeys(slidoHooks.enterSlidoEmail,"user26@paftr0.onmicrosoft.com",15000);
     await click(slidoHooks.continueBtn,15000);
     await click(slidoHooks.passwordSlidoLogin,15000);
     await typeKeys(slidoHooks.passwordSlidoLogin,"Paft@123",10000);
     await click(slidoHooks.slidoLoginBtn,15000);
     await this.switchToTeamsMainWindow();
     if(await isWeb()){
        await this.switchToIFrame();
    }
     await click(slidoHooks.createNewSlido,10000);
     if (await isWeb()) {
        await browser.switchToParentFrame();
        await browser.switchToParentFrame();
     }
    }
    //to be asked --

    async createPollUsingSlido(){
        
    }
    

    async seeAllChannelInfo() {
        await waitTillDisplayed(slidoHooks.channelInfoIcon);
        await click(slidoHooks.channelInfoIcon, 30000);
        await browser.pause(3000);
        await visible(slidoHooks.seeAll, 20000);
 
        if ((await $(slidoHooks.seeAll)).isClickable, 20000) {
            await click(slidoHooks.seeAll);
        }
 
        await browser.pause(2000);
    }//for funtional use



    async addSlidoFromGetMoreApp(teamName: string, channelName: string, Slido: string){
        if (await isWeb()){
            await browser.switchWindow("https://teams.microsoft.com/v2");
        }
        const el = await $(appBarHooks.teamsBtn).getAttribute('aria-pressed');
        if (el == 'false') {
            await click(appBarHooks.teamsBtn, 30000);
        }
        await click(slidoHooks.channelClick(teamName, channelName), 20000);
        await this.seeAllChannelInfo();
        await click(slidoHooks.clickToThreeDots, 20000);  // In Channel Info
        await click(slidoHooks.manageTeam, 20000);
        await click(slidoHooks.clickAppsBtn, 20000);
        await click(slidoHooks.getMoreApps, 20000);
        await click(slidoHooks.clickSearchBox,20000);
        await typeKeys(slidoHooks.clickSearchBox, Slido ,20000);
        await click(slidoHooks.selectSlido,20000);
        await browser.pause(10000);
        await click(slidoHooks.addAppToTeams,20000);
        await click(slidoHooks.inputChannelName,20000);
        await typeKeys(slidoHooks.inputChannelName,channelName,20000);
        await click(slidoHooks.selectChatOrChannel(channelName),20000);
        await click(slidoHooks.GoInChat,20000);
        await click(slidoHooks.saveBtnSlido,20000);
        }//passed



    async renameSlidoTab(Slido:string){
        await click(slidoHooks.openApp, 20000);
        // await visible(addTabHooks.addNewApp,20000);
         await click(slidoHooks.searchBtnOpenApp,20000);   
         await typeKeys(slidoHooks.searchBtnOpenApp, Slido, 20000);
         await visibleReturnable(slidoHooks.addSlidoApp,50000);
         await click(slidoHooks.addSlidoApp,20000);
         await browser.pause(2000);   
         await click(slidoHooks.pinSlido,20000);
         await click(slidoHooks.clickSaveBtn,20000);
         await browser.pause(5000);
         await this.goToTab(Slido);
        // await click(slidoHooks.slidoClickChatHeader,10000);
         await click(slidoHooks.renameBtn,10000);
         await click(slidoHooks.rename,10000);
         await typeKeys(slidoHooks.rename,"renamed",10000);
         await click(slidoHooks.saveRename,10000);
         await browser.pause(5000);
       
    }//

    async removeSlidoTab(Slido:string){
        await click(slidoHooks.openApp, 20000);
        // await visible(addTabHooks.addNewApp,20000);
         await click(slidoHooks.searchBtnOpenApp,20000);   
         await typeKeys(slidoHooks.searchBtnOpenApp, "Slido", 20000);
         await visibleReturnable(slidoHooks.addSlidoApp,50000);
         await click(slidoHooks.addSlidoApp,20000);
         await browser.pause(2000);   
         await click(slidoHooks.pinSlido,20000);
         await click(slidoHooks.clickSaveBtn,20000);
         await browser.pause(5000);
         await this.goToTab(Slido);
         //await click(slidoHooks.slidoClickChatHeader,10000);
         await click(slidoHooks.removeBtn,10000);
         await click(slidoHooks.confirmRemoveBtn,10000);
         await browser.pause(5000);


    }

    async expandSlidoTab(Slido:string){
        await click(slidoHooks.openApp, 20000);
        // await visible(addTabHooks.addNewApp,20000);
         await click(slidoHooks.searchBtnOpenApp,20000);   
         await typeKeys(slidoHooks.searchBtnOpenApp, "Slido", 20000);
         await visibleReturnable(slidoHooks.addSlidoApp,50000);
         await click(slidoHooks.addSlidoApp,20000);
         await browser.pause(2000);   
         await click(slidoHooks.pinSlido,20000);
         await click(slidoHooks.clickSaveBtn,20000);
         await browser.pause(5000);
         await this.goToTab(Slido);
        // await click(slidoHooks.slidoClickChatHeader,10000);
         await click(slidoHooks.expandBtn,10000);
         await browser.pause(5000);
    }

    async reloadSlidoTab(Slido:string){
        await click(slidoHooks.openApp, 20000);
        // await visible(addTabHooks.addNewApp,20000);
         await click(slidoHooks.searchBtnOpenApp,20000);   
         await typeKeys(slidoHooks.searchBtnOpenApp,Slido,20000);
         await visibleReturnable(slidoHooks.addSlidoApp,50000);
         await click(slidoHooks.addSlidoApp,20000);
         await browser.pause(2000);   
         await click(slidoHooks.pinSlido,20000);
         await click(slidoHooks.clickSaveBtn,20000);
         await browser.pause(5000);
         await this.goToTab(Slido);
        // await click(slidoHooks.slidoClickChatHeader,10000);
         await click(slidoHooks.reloadSlidoBtn,10000);
         await browser.pause(5000);

    }

    async copyTabLink(Slido:string){
        await click(slidoHooks.openApp, 20000);
        // await visible(addTabHooks.addNewApp,20000);
         await click(slidoHooks.searchBtnOpenApp,20000);   
         await typeKeys(slidoHooks.searchBtnOpenApp, Slido, 20000);
         await visibleReturnable(slidoHooks.addSlidoApp,50000);
         await click(slidoHooks.addSlidoApp,20000);
         await browser.pause(2000);   
         await click(slidoHooks.pinSlido,20000);
         await click(slidoHooks.clickSaveBtn,20000);
         await browser.pause(5000);
         await this.goToTab(Slido);
        // await click(slidoHooks.slidoClickChatHeader,10000);
         await click(slidoHooks.copyLinkBtn,10000);
         await browser.pause(5000);
    }

   
}
