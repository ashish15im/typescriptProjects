// Generate Tables HTML
export function generateTablesHTML(): string {
    return `
      <div class="container">
          <!-- Large Table -->
          <div class="large-table-container table-container">            
              <div class="table-wrapper">
                  <div class="table-component">
                      <div class="table-header">
                          <div class="table-row">
                              <div class="table-heading header-col1 col-1">Column 1</div>
                              <div class="table-heading header-col2 col-2">Column 2</div>
                              <div class="table-heading header-col3 col-3">Column 3</div>
                              <div class="table-heading header-col4 col-4">Column 4</div>
                              <div class="table-heading header-col5 col-5">Column 5</div>
                          </div>
                      </div>
                      <div class="table-scroll">   
                          <div class="table-body">
                              <!--  rows of sample data for scrolling -->
                              <div class="table-row">
                                  <div class="table-cell col-1">Data 1-1</div>
                                  <div class="table-cell col-2">Data 1-2</div>
                                  <div class="table-cell col-3">Data 1-3</div>
                                  <div class="table-cell col-4">Data 1-4</div>
                                  <div class="table-cell col-5">Data 1-5</div>
                              </div>
                              
                              <div class="table-row">
                                  <div class="table-cell col-1">Data 2-1</div>
                                  <div class="table-cell col-2">Data 2-2</div>
                                  <div class="table-cell col-3">Data 2-3</div>
                                  <div class="table-cell col-4">Data 2-4</div>
                                  <div class="table-cell col-5">Data 2-5</div>
                              </div>
                              <!-- Additional rows -->
                              <div class="table-row">
                                  <div class="table-cell col-1">Data 3-1</div>
                                  <div class="table-cell col-2">Data 3-2</div>
                                  <div class="table-cell col-3">Data 3-3</div>
                                  <div class="table-cell col-4">Data 3-4</div>
                                  <div class="table-cell col-5">Data 3-5</div>
                              </div>
                              <!-- More rows... -->
                              <div class="table-row">
                                  <div class="table-cell col-1">Data 4-1</div>
                                  <div class="table-cell col-2">Data 4-2</div>
                                  <div class="table-cell col-3">Data 4-3</div>
                                  <div class="table-cell col-4">Data 4-4</div>
                                  <div class="table-cell col-5">Data 4-5</div>
                              </div>
                              <div class="table-row">
                                  <div class="table-cell col-1">Data 5-1</div>
                                  <div class="table-cell col-2">Data 5-2</div>
                                  <div class="table-cell col-3">Data 5-3</div>
                                  <div class="table-cell col-4">Data 5-4</div>
                                  <div class="table-cell col-5">Data 5-5</div>
                              </div>
                              <!-- Additional rows for scrolling -->
                              <div class="table-row">
                                  <div class="table-cell col-1">Data 6-1</div>
                                  <div class="table-cell col-2">Data 6-2</div>
                                  <div class="table-cell col-3">Data 6-3</div>
                                  <div class="table-cell col-4">Data 6-4</div>
                                  <div class="table-cell col-5">Data 6-5</div>
                              </div>
                              <!-- More rows... -->
                              <div class="table-row">
                                  <div class="table-cell col-1">Data 7-1</div>
                                  <div class="table-cell col-2">Data 7-2</div>
                                  <div class="table-cell col-3">Data 7-3</div>
                                  <div class="table-cell col-4">Data 7-4</div>
                                  <div class="table-cell col-5">Data 7-5</div>                                
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          
          <!-- Small Table -->
          <div class="small-table-container table-container">            
              <div class="table-wrapper">
                  <div class="table-component">
                      <div class="table-header">
                          <div class="table-row">
                              <div class="table-heading header-col1 small-col-1">Column 1</div>
                              <div class="table-heading header-col2 small-col-2">Column 2</div>
                              <div class="table-heading header-col3 small-col-3">Column 3</div>
                          </div>
                      </div>
                      <div class="small-table-scroll">
                          <div class="table-body">
                              <!-- Sample data for scrolling -->
                              <div class="table-row">
                                  <div class="table-cell small-col-1">Data 1-1</div>
                                  <div class="table-cell small-col-2">Data 1-2</div>
                                  <div class="table-cell small-col-3">Data 1-3</div>
                              </div>
                              <div class="table-row">
                                  <div class="table-cell small-col-1">Data 2-1</div>
                                  <div class="table-cell small-col-2">Data 2-2</div>
                                  <div class="table-cell small-col-3">Data 2-3</div>
                              </div>
                              <div class="table-row">
                                  <div class="table-cell small-col-1">Data 3-1</div>
                                  <div class="table-cell small-col-2">Data 3-2</div>
                                  <div class="table-cell small-col-3">Data 3-3</div>
                              </div>
                              <div class="table-row">
                                  <div class="table-cell small-col-1">Data 4-1</div>
                                  <div class="table-cell small-col-2">Data 4-2</div>
                                  <div class="table-cell small-col-3">Data 4-3</div>
                              </div>
                              <div class="table-row">
                                  <div class="table-cell small-col-1">Data 5-1</div>
                                  <div class="table-cell small-col-2">Data 5-2</div>
                                  <div class="table-cell small-col-3">Data 5-3</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      `
  }
  