import React from 'react';

function accessory(props) {
    return (
        <>
            <div class="flex ml-[45px] mt-[10px]">
                <div>
                    <a href="./index.html" class="text-black no-underline flex items-center">
                        <i class="fa-solid fa-house-chimney"></i>
                        <span class="ml-1">Trang chủ |</span>
                    </a>
                </div>
                <span class="ml-[10px]">Phụ kiện</span>
            </div>

            <div class="mt-[80px] ml-[45px] flex justify-between">
                <div>
                    <h1 class="uppercase text-[35px] font-semibold font-sans">Phụ kiện</h1>
                    <div class="relative flex mt-[21px]">
                        <h4 class="mt-[21px]">BỘ LỌC</h4>
                        <ul class="flex ml-[50px] mt-[21px]">
                            <li class="list-none text-[16px] mx-[27px]">
                                <a href="#" class="text-black no-underline">Màu Sắc <i class="fa-solid fa-angle-down"></i></a>
                            </li>
                            <li class="list-none text-[16px] mx-[27px]">
                                <a href="#" class="text-black no-underline">Kích cỡ <i class="fa-solid fa-angle-down"></i></a>
                            </li>
                            <li class="list-none text-[16px] mx-[27px]">
                                <a href="#" class="text-black no-underline">Khoảng giá <i class="fa-solid fa-angle-down"></i></a>
                            </li>
                        </ul>

                        <div class="hidden group-hover:block absolute z-[1] border border-gray-200 bg-white p-[10px] top-[55px] left-[130px] w-full">
                            <div class="flex gap-6">

                                <div class="flex flex-wrap gap-2">
                                    <div class="w-6 h-6 bg-red-500"></div>
                                    <div class="w-6 h-6 bg-blue-500"></div>
                                    <div class="w-6 h-6 bg-yellow-300"></div>
                                    <div class="w-6 h-6 bg-gray-500"></div>
                                    <div class="w-6 h-6 bg-black"></div>
                                    <div class="w-6 h-6 bg-white border"></div>
                                    <div class="w-6 h-6 bg-pink-400"></div>
                                    <div class="w-6 h-6 bg-amber-900"></div>
                                </div>


                                <div class="flex flex-col gap-2">
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" id="size-s" />
                                        <span>S</span>
                                    </label>
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" id="size-m" />
                                        <span>M</span>
                                    </label>
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" id="size-l" />
                                        <span>L</span>
                                    </label>
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" id="size-xl" />
                                        <span>XL</span>
                                    </label>
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" id="size-2xl" />
                                        <span>2XL</span>
                                    </label>
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" id="size-3xl" />
                                        <span>3XL</span>
                                    </label>
                                </div>


                                <div class="flex flex-col gap-2">
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" id="price-1" />
                                        <span>Dưới 200k</span>
                                    </label>
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" id="price-2" />
                                        <span>Từ 200k - 500k</span>
                                    </label>
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" id="price-3" />
                                        <span>Từ 500k - 1 triệu</span>
                                    </label>
                                    <label class="flex items-center gap-2">
                                        <input type="checkbox" id="price-4" />
                                        <span>Trên 1 triệu</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="flex items-center mt-[107px] mr-[50px]">
                    <h5 class="-mt-2">Sắp xếp theo:</h5>
                    <select class="ml-[20px] h-[18px] -mt-[2px]">
                        <option>Mới nhất</option>
                        <option>Giá giảm dần</option>
                        <option>Giá tăng dần</option>
                        <option>Sale</option>
                    </select>
                </div>
            </div>


            <div class="block px-[40px] box-border">
                <div class="flex flex-wrap text-center mt-[40px] mx-[25px]">
                    <div class="basis-1/4 p-[15px] mb-[30px] box-border">
                        <div class="mb-[10px] relative overflow-hidden">
                            <a href="#" class="block min-w-[280px]">
                                <img class="transition duration-300 ease-out hover:scale-110 w-full" src="https://pos.nvncdn.net/be3159-662/ps/20230626_g1qdAyXuwb.jpeg" />
                            </a>
                        </div>

                        <div class="text-center inline-block">
                            <ul class="flex gap-2 justify-center">
                                <li class="rounded-full border border-white w-[30px] h-[30px] p-[2px] overflow-hidden z-10 relative">
                                    <img src="https://pos.nvncdn.net/be3159-662/ps/20230626_8FrmkhEk3S.jpeg" class="rounded-full" />
                                </li>
                                <li class="rounded-full border border-white w-[30px] h-[30px] p-[2px] overflow-hidden z-10 relative">
                                    <img src="https://pos.nvncdn.net/be3159-662/ps/20230626_K8LF5AKoCu.jpeg" class="rounded-full" />
                                </li>
                            </ul>
                        </div>

                        <div class="mt-2">
                            <a href="#" class="block text-black no-underline">Dây Lưng Karik 0029</a>
                            <span class="block font-semibold">419.000₫</span>
                        </div>

                        <div class="mt-2">
                            <ul class="flex justify-around border border-black p-[10px]">
                                <li>
                                    <a href="#" class="text-black pr-[40px] mr-[-30px] border-r border-black hover:text-white hover:border-white">Mua Ngay</a>
                                </li>
                                <li>
                                    <a href="./product.html" class="text-black hover:text-white">Chi Tiết</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default accessory;