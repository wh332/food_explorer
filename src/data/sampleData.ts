import { Dish, Cuisine } from '../stores/foodStore'

export const sampleDishes: Dish[] = [
  // 川菜代表菜品
  {
    id: '1',
    dish_name: '水煮鱼',
    cuisine_name: '川菜',
    image_url: 'https://picsum.photos/400/300?random=11',
    difficulty: '中等',
    time_required: '40分钟',
    ingredients: ['草鱼片 300g', '豆芽 200g', '干辣椒 20个', '花椒 2汤匙', '郫县豆瓣酱 3汤匙', '姜蒜适量', '料酒2汤匙'],
    steps: [
      '鱼片用料酒、淀粉腌制10分钟',
      '豆芽焯水后铺在碗底',
      '热油爆香豆瓣酱、姜蒜',
      '加入适量水煮开，放入鱼片煮2分钟',
      '鱼片捞出放在豆芽上，撒上干辣椒和花椒',
      '淋上热油即可'
    ],
    description: '麻辣鲜香，鱼肉嫩滑，是川菜的代表作',
    rating: 4.9
  },
  {
    id: '2',
    dish_name: '麻婆豆腐',
    cuisine_name: '川菜',
    image_url: 'https://picsum.photos/400/300?random=12',
    difficulty: '中等',
    time_required: '30分钟',
    ingredients: ['豆腐 300g', '猪肉末 100g', '豆瓣酱 2汤匙', '花椒 1茶匙', '葱姜蒜适量', '辣椒粉适量'],
    steps: [
      '豆腐切块，放入沸水中焯水2分钟，捞出沥干',
      '热锅凉油，放入猪肉末炒至变色',
      '加入豆瓣酱、葱姜蒜炒出红油',
      '加入适量水，放入豆腐块，小火煮10分钟',
      '最后撒上花椒粉和葱花即可'
    ],
    description: '麻辣鲜香的经典川菜，豆腐嫩滑，味道浓郁',
    rating: 4.8
  },
  
  // 粤菜代表菜品
  {
    id: '3',
    dish_name: '白切鸡',
    cuisine_name: '粤菜',
    image_url: 'https://picsum.photos/400/300?random=13',
    difficulty: '简单',
    time_required: '35分钟',
    ingredients: ['三黄鸡 1只', '姜片适量', '葱段适量', '料酒2汤匙', '冰水适量'],
    steps: [
      '整鸡处理干净，内外抹盐',
      '锅中放水，加入姜片、葱段、料酒煮开',
      '手提鸡头，将鸡身浸入沸水10秒，提起，重复3次',
      '整鸡放入锅中，小火煮20分钟',
      '捞出立即放入冰水中冷却',
      '斩件装盘，配姜葱蘸料'
    ],
    description: '皮爽肉滑，原汁原味，是粤菜经典',
    rating: 4.7
  },
  
  // 鲁菜代表菜品
  {
    id: '4',
    dish_name: '葱烧海参',
    cuisine_name: '鲁菜',
    image_url: 'https://picsum.photos/400/300?random=14',
    difficulty: '困难',
    time_required: '90分钟',
    ingredients: ['水发海参 300g', '大葱 200g', '高汤 500ml', '老抽1汤匙', '料酒2汤匙', '姜片适量'],
    steps: [
      '海参洗净，用高汤煨制30分钟',
      '大葱切段，用油炸至金黄',
      '锅中留底油，爆香姜片',
      '加入海参、葱段，烹入料酒',
      '加入高汤，小火炖煮40分钟',
      '最后大火收汁即可'
    ],
    description: '海参软糯，葱香浓郁，是鲁菜名品',
    rating: 4.9
  },
  
  // 苏菜代表菜品
  {
    id: '5',
    dish_name: '松鼠鳜鱼',
    cuisine_name: '苏菜',
    image_url: 'https://picsum.photos/400/300?random=15',
    difficulty: '困难',
    time_required: '60分钟',
    ingredients: ['鳜鱼 1条', '番茄酱 3汤匙', '白糖 2汤匙', '醋 1汤匙', '淀粉适量', '青豆、玉米粒适量'],
    steps: [
      '鳜鱼去骨，切花刀，裹淀粉',
      '油温七成热，炸至金黄酥脆',
      '锅中留底油，炒香番茄酱',
      '加入糖、醋、适量水煮开',
      '勾芡后淋在鱼上',
      '撒上青豆、玉米粒装饰'
    ],
    description: '形似松鼠，外酥里嫩，酸甜可口',
    rating: 4.8
  },
  
  // 家常菜新增
  {
    id: '6',
    dish_name: '番茄炒蛋',
    cuisine_name: '家常菜',
    image_url: 'https://picsum.photos/400/300?random=16',
    difficulty: '简单',
    time_required: '15分钟',
    ingredients: ['鸡蛋 3个', '番茄 2个', '葱花适量', '盐适量', '糖1茶匙'],
    steps: [
      '鸡蛋打散，番茄切块',
      '热油炒熟鸡蛋盛出',
      '用余油炒番茄至出汁',
      '加入鸡蛋翻炒，调味即可'
    ],
    description: '简单美味的家常菜，营养丰富',
    rating: 4.5
  },
  {
    id: '7',
    dish_name: '红烧肉',
    cuisine_name: '家常菜',
    image_url: 'https://picsum.photos/400/300?random=17',
    difficulty: '中等',
    time_required: '60分钟',
    ingredients: ['五花肉 500g', '老抽2汤匙', '冰糖 30g', '料酒2汤匙', '姜片适量'],
    steps: [
      '五花肉切块焯水',
      '冰糖炒出糖色',
      '放入肉块翻炒上色',
      '加入调料小火炖煮40分钟'
    ],
    description: '色泽红亮，肥而不腻的传统名菜',
    rating: 4.9
  },
  {
    id: '8',
    dish_name: '青椒土豆丝',
    cuisine_name: '家常菜',
    image_url: 'https://picsum.photos/400/300?random=18',
    difficulty: '简单',
    time_required: '20分钟',
    ingredients: ['土豆 2个', '青椒 1个', '蒜末适量', '醋1汤匙', '盐适量'],
    steps: [
      '土豆、青椒切丝',
      '土豆丝用清水浸泡去淀粉',
      '热油爆香蒜末',
      '放入土豆丝、青椒丝快速翻炒',
      '淋入醋，调味即可'
    ],
    description: '清脆爽口，简单易做的家常菜',
    rating: 4.4
  },
  {
    id: '9',
    dish_name: '鱼香肉丝',
    cuisine_name: '家常菜',
    image_url: 'https://picsum.photos/400/300?random=19',
    difficulty: '中等',
    time_required: '25分钟',
    ingredients: ['猪里脊 200g', '木耳 50g', '胡萝卜 1根', '泡椒2汤匙', '葱姜蒜适量'],
    steps: [
      '肉丝用淀粉腌制',
      '木耳、胡萝卜切丝',
      '热油滑炒肉丝盛出',
      '爆香泡椒、葱姜蒜',
      '放入蔬菜丝翻炒',
      '加入肉丝和鱼香汁炒匀'
    ],
    description: '鱼香味浓，酸甜微辣，下饭佳品',
    rating: 4.7
  }
]

export const sampleCuisines: Cuisine[] = [
  {
    id: '1',
    name: '川菜',
    description: '以麻辣著称，讲究一菜一格，百菜百味',
    characteristics: ['麻辣', '鲜香', '味浓'],
    representative_dishes: ['水煮鱼', '麻婆豆腐', '宫保鸡丁', '回锅肉'],
    image_url: 'https://picsum.photos/400/300?random=1',
    region: '四川地区',
    history: '川菜起源于古代巴国和蜀国，已有3000多年历史。明清时期达到鼎盛，形成了"一菜一格，百菜百味"的特点。',
    features: '以麻辣为主，兼有酸、甜、苦、香、咸等多种味道，讲究调味，注重火候。'
  },
  {
    id: '2',
    name: '粤菜',
    description: '清淡鲜美，注重食材原味',
    characteristics: ['清淡', '鲜美', '精致'],
    representative_dishes: ['白切鸡', '烧鹅', '清蒸鱼', '叉烧'],
    image_url: 'https://picsum.photos/400/300?random=2',
    region: '广东地区',
    history: '粤菜源于秦汉，兴于唐宋，盛于明清。受海外贸易影响，融合了中西烹饪技法。',
    features: '讲究清、鲜、爽、嫩、滑，注重食材本味，烹饪技法多样，尤以蒸、炒、焖见长。'
  },
  {
    id: '3',
    name: '鲁菜',
    description: '讲究火候，口味咸鲜',
    characteristics: ['咸鲜', '醇厚', '讲究火候'],
    representative_dishes: ['葱烧海参', '糖醋鲤鱼', '九转大肠'],
    image_url: 'https://picsum.photos/400/300?random=3',
    region: '山东地区',
    history: '鲁菜是中国历史最悠久的菜系之一，起源于春秋战国时期，是北方菜系的代表。',
    features: '口味咸鲜，讲究火候，擅长爆、炒、烧、炸等技法，注重汤的运用。'
  },
  {
    id: '4',
    name: '苏菜',
    description: '口味平和，擅长炖焖',
    characteristics: ['平和', '鲜甜', '炖焖'],
    representative_dishes: ['松鼠鳜鱼', '清炖蟹粉', '盐水鸭'],
    image_url: 'https://picsum.photos/400/300?random=4',
    region: '江苏地区',
    history: '苏菜起源于南北朝时期，明清时期达到鼎盛，是江南饮食文化的代表。',
    features: '口味平和，咸甜适中，讲究刀工，注重造型，擅长炖、焖、煨、焐等技法。'
  },
  {
    id: '5',
    name: '浙菜',
    description: '清新爽口，注重本味',
    characteristics: ['清新', '爽口', '本味'],
    representative_dishes: ['西湖醋鱼', '东坡肉', '龙井虾仁'],
    image_url: 'https://picsum.photos/400/300?random=5',
    region: '浙江地区',
    history: '浙菜源于南宋时期，受江南水乡影响，形成了独特的饮食风格。',
    features: '清新爽口，注重食材本味，讲究时令，擅长炒、炸、烩、熘等技法。'
  },
  {
    id: '6',
    name: '闽菜',
    description: '以海味为主，讲究汤菜',
    characteristics: ['海味', '汤菜', '鲜醇'],
    representative_dishes: ['佛跳墙', '荔枝肉', '醉排骨'],
    image_url: 'https://picsum.photos/400/300?random=6',
    region: '福建地区',
    history: '闽菜起源于唐代，受海洋文化影响，形成了独特的海鲜烹饪技法。',
    features: '以海味为主，讲究汤菜，口味清鲜，擅长炒、蒸、煨等技法。'
  },
  {
    id: '7',
    name: '湘菜',
    description: '香辣酸辣，口味浓郁',
    characteristics: ['香辣', '酸辣', '浓郁'],
    representative_dishes: ['剁椒鱼头', '毛氏红烧肉', '腊味合蒸'],
    image_url: 'https://picsum.photos/400/300?random=7',
    region: '湖南地区',
    history: '湘菜起源于汉代，受楚文化影响，形成了独特的辣味风格。',
    features: '香辣酸辣并重，口味浓郁，讲究入味，擅长煨、炖、腊、蒸等技法。'
  },
  {
    id: '8',
    name: '徽菜',
    description: '重油重色，讲究火工',
    characteristics: ['重油', '重色', '火工'],
    representative_dishes: ['臭鳜鱼', '毛豆腐', '火腿炖甲鱼'],
    image_url: 'https://picsum.photos/400/300?random=8',
    region: '安徽地区',
    history: '徽菜起源于南宋时期，受徽商文化影响，形成了独特的烹饪风格。',
    features: '重油重色，讲究火工，擅长烧、炖、蒸等技法，注重原汁原味。'
  }
]