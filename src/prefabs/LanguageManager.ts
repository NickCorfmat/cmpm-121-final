export type Language = 'en' | 'ar' | 'zh';

export const translations: { [key in Language]: { [key: string]: string } } = {
    en: {
        title: "Mining Simulator",
        collectResources: "Collect Resources",
        save: "Save",
        load: "Load",
        file: "File",
        back: "Back",
        undo: "Undo",
        redo: "Redo",
        playerStats: "Player Stats",
        resources: "Resources",
        turns: "Turns",
        buildingsPlaced: "Buildings Placed",
        actions: "Actions",
        buyDrill: "Buy Drill",
        buyExcavator: "Buy Excavator",
        buyDemolitionPlant: "Buy Demolition Plant",
        startNextRound: "Start Next Round",
        collect: "Collect",
        win: "You Win!",
        buildingsPlacedStat: "Buildings Placed",
        resourcesCollected: "Resources Collected",
        turnsPlayed: "Turns Played",
        collectGoal: "Collect 1000 Resources to Win!",
    },
    ar: {
        title: "محاكي التعدين",
        collectResources: "جمع الموارد",
        save: "حفظ",
        load: "تحميل",
        file: "ملف",
        back: "رجوع",
        undo: "تراجع",
        redo: "إعادة",
        playerStats: "إحصائيات اللاعب",
        resources: "الموارد",
        turns: "الأدوار",
        buildingsPlaced: "المباني الموضوعة",
        actions: "الإجراءات",
        buyDrill: "شراء الحفار",
        buyExcavator: "شراء الحفار",
        buyDemolitionPlant: "شراء مصنع الهدم",
        startNextRound: "بدء الجولة التالية",
        collect: "جمع",
        win: "لقد فزت!",
        buildingsPlacedStat: "المباني الموضوعة",
        resourcesCollected: "الموارد المجمعة",
        turnsPlayed: "الأدوار التي تم لعبها",
        collectGoal: "اجمع 1000 مورد للفوز!",
    },
    zh: {
        title: "采矿模拟器",
        collectResources: "收集资源",
        save: "保存",
        load: "加载",
        file: "文件",
        back: "返回",
        undo: "撤销",
        redo: "重做",
        playerStats: "玩家统计",
        resources: "资源",
        turns: "回合",
        buildingsPlaced: "放置的建筑",
        actions: "操作",
        buyDrill: "购买钻机",
        buyExcavator: "购买挖掘机",
        buyDemolitionPlant: "购买拆除厂",
        startNextRound: "开始下一轮",
        collect: "收集",
        win: "你赢了!",
        buildingsPlacedStat: "放置的建筑",
        resourcesCollected: "收集的资源",
        turnsPlayed: "玩的回合",
        collectGoal: "收集1000资源以获胜!",
    },
};

export class LanguageManager {
    private static currentLanguage: Language = 'en';

    static setLanguage(language: Language): void {
        this.currentLanguage = language;
        this.updateText();
    }

    static getTranslation(key: string): string {
        return translations[this.currentLanguage][key] || key;
    }

    static updateText(): void {
        document.querySelectorAll("[data-translate]").forEach((element) => {
            const key = element.getAttribute("data-translate");
            if (key) {
                element.textContent = this.getTranslation(key);
            }
        });
    }
}