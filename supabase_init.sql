-- Supabase数据库初始化脚本
-- 为美食探索者项目创建必要的表结构

-- 1. 创建用户照片表
CREATE TABLE IF NOT EXISTS user_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    cuisine_name TEXT,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_avatar BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建菜系数据表
CREATE TABLE IF NOT EXISTS cuisine_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    characteristics TEXT[],
    representative_dishes TEXT[],
    image_url TEXT,
    region TEXT,
    history TEXT,
    features TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建菜品数据表
CREATE TABLE IF NOT EXISTS dish_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    cuisine_id UUID REFERENCES cuisine_data(id),
    cuisine_name TEXT NOT NULL,
    image_url TEXT,
    difficulty TEXT CHECK (difficulty IN ('简单', '中等', '困难')),
    time_required TEXT,
    ingredients TEXT[],
    steps TEXT[],
    description TEXT,
    rating NUMERIC(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    dish_id UUID REFERENCES dish_data(id),
    dish_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, dish_id)
);

-- 5. 启用行级安全策略
ALTER TABLE user_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuisine_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE dish_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- 6. 创建行级安全策略
-- 用户照片策略：用户只能访问自己的照片
CREATE POLICY "用户只能访问自己的照片" ON user_photos
    FOR ALL USING (auth.uid()::text = user_id);

-- 菜系数据策略：所有人都可以读取
CREATE POLICY "所有人都可以读取菜系数据" ON cuisine_data
    FOR SELECT USING (true);

-- 菜品数据策略：所有人都可以读取
CREATE POLICY "所有人都可以读取菜品数据" ON dish_data
    FOR SELECT USING (true);

-- 用户收藏策略：用户只能访问自己的收藏
CREATE POLICY "用户只能访问自己的收藏" ON user_favorites
    FOR ALL USING (auth.uid()::text = user_id);

-- 7. 插入菜系示例数据
INSERT INTO cuisine_data (name, description, characteristics, representative_dishes, region, features, image_url) VALUES
('川菜', '四川菜系，以麻辣著称', '{"麻辣", "鲜香", "味厚"}', '{"麻婆豆腐", "宫保鸡丁", "水煮鱼"}', '西南地区', '重油重辣，口味浓郁', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop&auto=format'),
('粤菜', '广东菜系，清淡鲜美', '{"清淡", "鲜美", "精致"}', '{"白切鸡", "烧鹅", "清蒸鱼"}', '华南地区', '注重食材原味，烹饪精细', 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=600&h=400&fit=crop&auto=format'),
('鲁菜', '山东菜系，讲究火候', '{"咸鲜", "醇厚", "讲究火候"}', '{"糖醋鲤鱼", "九转大肠", "葱烧海参"}', '华北地区', '口味咸鲜，技法多样', 'https://images.unsplash.com/photo-1569058242252-623a295d8f3a?w=600&h=400&fit=crop&auto=format'),
('苏菜', '江苏菜系，清淡鲜美', '{"清淡", "鲜美", "精致"}', '{"松鼠鳜鱼", "清炖蟹粉狮子头", "响油鳝糊"}', '华东地区', '注重刀工，讲究火候', 'https://images.unsplash.com/photo-1569058242253-92e9c2c5b6e9?w=600&h=400&fit=crop&auto=format'),
('浙菜', '浙江菜系，清淡鲜美', '{"清淡", "鲜美", "精致"}', '{"龙井虾仁", "油焖春笋", "虾爆鳝面"}', '华东地区', '注重时令，讲究原味', 'https://images.unsplash.com/photo-1569058242254-92e9c2c5b6ea?w=600&h=400&fit=crop&auto=format'),
('闽菜', '福建菜系，清淡鲜美', '{"清淡", "鲜美", "精致"}', '{"荔枝肉", "醉排骨", "沙茶牛肉"}', '华东地区', '注重汤菜，讲究调味', 'https://images.unsplash.com/photo-1569058242255-92e9c2c5b6eb?w=600&h=400&fit=crop&auto=format'),
('湘菜', '湖南菜系，香辣可口', '{"香辣", "鲜香", "味厚"}', '{"毛氏红烧肉", "辣椒炒肉", "小炒黄牛肉"}', '华中地区', '口味香辣，注重火候', 'https://images.unsplash.com/photo-1569058242256-92e9c2c5b6ec?w=600&h=400&fit=crop&auto=format'),
('徽菜', '安徽菜系，讲究火候', '{"咸鲜", "醇厚", "讲究火候"}', '{"臭鳜鱼", "毛豆腐", "火腿炖甲鱼"}', '华东地区', '注重火工，讲究原味', 'https://images.unsplash.com/photo-1569058242257-92e9c2c5b6ed?w=600&h=400&fit=crop&auto=format');

-- 8. 插入菜品示例数据
-- 插入苏菜菜品数据
INSERT INTO dish_data (name, cuisine_name, difficulty, time_required, ingredients, steps, description, rating, image_url) VALUES
('松鼠鳜鱼', '苏菜', '困难', '50分钟', '{"鳜鱼 1条", "淀粉 50g", "糖 3汤匙", "醋 2汤匙", "番茄酱 1汤匙", "油 500ml"}', '{"鱼处理改刀", "挂糊炸制成型", "调制糖醋汁", "浇汁装盘"}', '外酥里嫩，酸甜可口，造型似松鼠，是苏菜代表作', 4.9, 'https://images.unsplash.com/photo-1569058242258-92e9c2c5b6ee?w=400&h=300&fit=crop&auto=format'),
('清炖蟹粉狮子头', '苏菜', '困难', '90分钟', '{"猪肉糜 300g", "蟹粉 100g", "葱姜适量", "料酒 1汤匙", "高汤 500ml"}', '{"肉糜与蟹粉搅匀", "搓成丸子", "文火炖煮40分钟", "出锅装汤"}', '肉质松软，汤汁清鲜，蟹香浓郁', 4.8, 'https://images.unsplash.com/photo-1569058242259-92e9c2c5b6ef?w=400&h=300&fit=crop&auto=format'),
('响油鳝糊', '苏菜', '中等', '25分钟', '{"鳝鱼 300g", "葱姜蒜适量", "酱油 2汤匙", "糖 1茶匙", "料酒 1汤匙"}', '{"鳝鱼切丝", "爆炒至糊状", "淋入热油增香", "快速出锅"}', '鳝糊滑嫩，香气扑鼻，滋补美味', 4.6, 'https://images.unsplash.com/photo-1569058242260-92e9c2c5b6f0?w=400&h=300&fit=crop&auto=format'),
('金陵盐水鸭', '苏菜', '中等', '60分钟', '{"鸭子 1只", "盐 100g", "花椒 2汤匙", "姜片 5片", "八角 2个"}', '{"腌制鸭子", "煮熟冷却", "切块装盘"}', '皮白肉嫩，咸香适口，南京特色名菜', 4.7, 'https://images.unsplash.com/photo-1569058242261-92e9c2c5b6f1?w=400&h=300&fit=crop&auto=format'),
('拆烩鲢鱼头', '苏菜', '困难', '40分钟', '{"鲢鱼头 1个", "火腿 50g", "冬笋 50g", "鸡汤 300ml"}', '{"鱼头拆肉", "炒香配料", "加入高汤烩煮", "收汁装盘"}', '鱼肉鲜嫩，汤汁醇厚，色香味俱全', 4.6, 'https://images.unsplash.com/photo-1569058242262-92e9c2c5b6f2?w=400&h=300&fit=crop&auto=format');

-- 插入浙菜菜品数据
INSERT INTO dish_data (name, cuisine_name, difficulty, time_required, ingredients, steps, description, rating, image_url) VALUES
('龙井虾仁', '浙菜', '简单', '20分钟', '{"鲜虾仁 200g", "龙井茶叶 2g", "蛋清 1个", "盐 1茶匙", "淀粉 1汤匙"}', '{"虾仁上浆", "泡好茶叶", "快炒虾仁入味"}', '虾仁鲜嫩，茶香清雅，是杭州名菜', 4.8, 'https://images.unsplash.com/photo-1569058242263-92e9c2c5b6f3?w=400&h=300&fit=crop&auto=format'),
('油焖春笋', '浙菜', '简单', '25分钟', '{"春笋 300g", "酱油 1汤匙", "糖 1汤匙", "油 2汤匙"}', '{"春笋焯水", "炒香调料", "焖煮入味"}', '春笋清香，酱味浓郁，春季佳肴', 4.5, 'https://images.unsplash.com/photo-1569058242264-92e9c2c5b6f4?w=400&h=300&fit=crop&auto=format'),
('虾爆鳝面', '浙菜', '中等', '30分钟', '{"鳝鱼 200g", "鲜虾 100g", "面条 150g", "葱姜适量", "酱油 1汤匙"}', '{"炒香虾鳝", "加入面条烹煮", "调味出锅"}', '鲜香滑爽，海味十足，是杭州传统面食', 4.6, 'https://images.unsplash.com/photo-1569058242265-92e9c2c5b6f5?w=400&h=300&fit=crop&auto=format'),
('干炸响铃', '浙菜', '简单', '15分钟', '{"腐皮 2张", "猪肉末 100g", "虾仁 50g", "盐 适量"}', '{"包好响铃卷", "下油锅炸至金黄"}', '外酥内嫩，鲜香四溢，杭州名小吃', 4.7, 'https://images.unsplash.com/photo-1569058242266-92e9c2c5b6f6?w=400&h=300&fit=crop&auto=format'),
('叫花鸡', '浙菜', '困难', '120分钟', '{"三黄鸡 1只", "荷叶 1张", "泥巴 500g", "酱油 2汤匙", "料酒 1汤匙"}', '{"鸡腌制", "包裹荷叶与泥巴", "烘烤2小时"}', '外焦内嫩，香气四溢，风味独特', 4.8, 'https://images.unsplash.com/photo-1569058242267-92e9c2c5b6f7?w=400&h=300&fit=crop&auto=format');

-- 插入闽菜菜品数据
INSERT INTO dish_data (name, cuisine_name, difficulty, time_required, ingredients, steps, description, rating, image_url) VALUES
('荔枝肉', '闽菜', '中等', '30分钟', '{"猪里脊 300g", "番茄酱 1汤匙", "糖 2汤匙", "醋 1汤匙", "淀粉 适量"}', '{"肉切块上浆", "炸制金黄", "调制酸甜汁翻炒"}', '色泽红亮，酸甜可口，是福建传统名菜', 4.7, 'https://images.unsplash.com/photo-1569058242268-92e9c2c5b6f8?w=400&h=300&fit=crop&auto=format'),
('醉排骨', '闽菜', '中等', '40分钟', '{"猪排骨 500g", "料酒 3汤匙", "糖 1汤匙", "酱油 1汤匙", "香料适量"}', '{"排骨炸制", "加入料酒焖煮", "收汁上桌"}', '酒香浓郁，肉质酥软，酸甜微辣', 4.6, 'https://images.unsplash.com/photo-1569058242269-92e9c2c5b6f9?w=400&h=300&fit=crop&auto=format'),
('沙茶牛肉', '闽菜', '简单', '20分钟', '{"牛肉片 200g", "沙茶酱 2汤匙", "洋葱 50g", "青椒 1个"}', '{"牛肉腌制", "炒香沙茶酱", "快速翻炒"}', '香气浓郁，微辣开胃，沙茶风味浓', 4.7, 'https://images.unsplash.com/photo-1569058242270-92e9c2c5b6fa?w=400&h=300&fit=crop&auto=format'),
('五香卷', '闽菜', '中等', '30分钟', '{"猪肉末 200g", "虾仁 50g", "豆腐皮 2张", "五香粉 1茶匙"}', '{"包成卷", "炸至金黄", "切段装盘"}', '外酥内嫩，香气扑鼻，闽南特色小吃', 4.6, 'https://images.unsplash.com/photo-1569058242271-92e9c2c5b6fb?w=400&h=300&fit=crop&auto=format'),
('海蛎煎', '闽菜', '简单', '15分钟', '{"海蛎 150g", "鸡蛋 2个", "地瓜粉 50g", "韭菜 30g"}', '{"调制面糊", "煎至金黄"}', '外脆内嫩，海味十足，是厦门著名小吃', 4.8, 'https://images.unsplash.com/photo-1569058242272-92e9c2c5b6fc?w=400&h=300&fit=crop&auto=format');

-- 插入湘菜菜品数据
INSERT INTO dish_data (name, cuisine_name, difficulty, time_required, ingredients, steps, description, rating, image_url) VALUES
('毛氏红烧肉', '湘菜', '困难', '90分钟', '{"五花肉 500g", "酱油 3汤匙", "糖 2汤匙", "料酒 1汤匙", "八角 2个"}', '{"焯水去腥", "炒糖色上色", "小火焖煮收汁"}', '肥而不腻，香甜可口，是湘菜名菜', 4.8, 'https://images.unsplash.com/photo-1569058242273-92e9c2c5b6fd?w=400&h=300&fit=crop&auto=format'),
('辣椒炒肉', '湘菜', '简单', '20分钟', '{"五花肉 200g", "青辣椒 150g", "蒜末 适量", "酱油 1汤匙"}', '{"肉片煸香", "加入辣椒炒熟"}', '香辣入味，下饭必备，湖南家常菜代表', 4.7, 'https://images.unsplash.com/photo-1569058242274-92e9c2c5b6fe?w=400&h=300&fit=crop&auto=format'),
('小炒黄牛肉', '湘菜', '中等', '25分钟', '{"黄牛肉 200g", "小米辣 5个", "姜蒜 适量", "酱油 1汤匙"}', '{"牛肉腌制", "爆炒至熟"}', '鲜香微辣，肉质嫩滑，辣味十足', 4.6, 'https://images.unsplash.com/photo-1569058242275-92e9c2c5b6ff?w=400&h=300&fit=crop&auto=format'),
('剁椒蒸茄子', '湘菜', '简单', '15分钟', '{"茄子 2根", "剁椒 2汤匙", "蒜末 适量", "酱油 1汤匙"}', '{"茄子蒸熟", "铺上剁椒蒜末", "淋热油"}', '酸辣鲜香，茄子软糯开胃', 4.5, 'https://images.unsplash.com/photo-1569058242276-92e9c2c5b700?w=400&h=300&fit=crop&auto=format'),
('腊味合蒸', '湘菜', '中等', '40分钟', '{"腊肉 100g", "腊肠 100g", "姜片 适量"}', '{"腊味切片", "铺碗蒸熟"}', '咸香扑鼻，油润可口，湖南冬日名菜', 4.6, 'https://images.unsplash.com/photo-1569058242277-92e9c2c5b701?w=400&h=300&fit=crop&auto=format');

-- 插入徽菜菜品数据
INSERT INTO dish_data (name, cuisine_name, difficulty, time_required, ingredients, steps, description, rating, image_url) VALUES
('臭鳜鱼', '徽菜', '困难', '120分钟', '{"鳜鱼 1条", "盐 适量", "葱姜蒜 适量", "辣椒 1个"}', '{"腌制发酵", "煎至金黄", "加料炖煮"}', '臭而不腥，香气独特，是徽州名菜', 4.9, 'https://images.unsplash.com/photo-1569058242278-92e9c2c5b702?w=400&h=300&fit=crop&auto=format'),
('毛豆腐', '徽菜', '中等', '60分钟', '{"毛豆腐 6块", "辣椒酱 2汤匙", "蒜末 适量", "油 适量"}', '{"煎制豆腐", "淋上辣椒酱"}', '外焦内嫩，发酵香浓郁', 4.6, 'https://images.unsplash.com/photo-1569058242279-92e9c2c5b703?w=400&h=300&fit=crop&auto=format'),
('火腿炖甲鱼', '徽菜', '困难', '90分钟', '{"甲鱼 1只", "火腿 100g", "高汤 500ml", "姜片 适量"}', '{"甲鱼处理", "加入火腿和高汤", "小火炖煮"}', '汤汁浓郁，肉质鲜嫩，滋补名菜', 4.8, 'https://images.unsplash.com/photo-1569058242280-92e9c2c5b704?w=400&h=300&fit=crop&auto=format'),
('腌鲜鳜鱼', '徽菜', '中等', '40分钟', '{"鳜鱼 1条", "火腿 50g", "笋片 50g", "姜片 适量"}', '{"腌制鳜鱼", "与火腿笋片炖煮"}', '鱼鲜味美，汤清不腻，徽菜代表', 4.7, 'https://images.unsplash.com/photo-1569058242281-92e9c2c5b705?w=400&h=300&fit=crop&auto=format'),
('黄山烧鸭', '徽菜', '中等', '60分钟', '{"鸭子 1只", "酱油 3汤匙", "糖 1汤匙", "料酒 1汤匙"}', '{"腌制鸭子", "烤制上色", "炖煮入味"}', '色泽红亮，味浓醇厚，是徽菜传统佳肴', 4.6, 'https://images.unsplash.com/photo-1569058242282-92e9c2c5b706?w=400&h=300&fit=crop&auto=format');

-- 9. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_photos_user_id ON user_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_dish_data_cuisine_id ON dish_data(cuisine_id);
CREATE INDEX IF NOT EXISTS idx_cuisine_data_name ON cuisine_data(name);
CREATE INDEX IF NOT EXISTS idx_dish_data_name ON dish_data(name);
CREATE INDEX IF NOT EXISTS idx_dish_data_cuisine_name ON dish_data(cuisine_name);